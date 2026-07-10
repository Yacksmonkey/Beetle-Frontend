"use client";

import { useEffect, useState } from "react";
import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
const FINAL_LEVEL = 4;

type PreferenceCard = {
    id: string;
    label: string;
    key: string;
    emoji: string | null;
    imageUrl: string | null;
    parentKey: string | null;
    level: number;
    active: boolean;
};

type RecommendationItem = {
    id: number;
    type: string;
    title: string;
    description: string;
    imageUrl: string | null;
    externalUrl: string | null;
    cardKey: string | null;
};

export default function Page() {
    const router = useRouter();

    const [currentCards, setCurrentCards] = useState<PreferenceCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentLevel, setCurrentLevel] = useState(1);
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    const [finishedPath, setFinishedPath] = useState<string | null>(null);

    const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

    async function loadCards(level: number, parentKey?: string, fallbackPath?: string[]) {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.set("level", String(level));
            params.set("active", "true");

            if (parentKey) {
                params.set("parentKey", parentKey);
            }

            const data = await api.get<PreferenceCard[]>(`/api/preferences/cards?${params.toString()}`)

            if (data.length === 0) {
                await finishFlow(fallbackPath ?? selectedPath);
                return;
            }

            setCurrentCards(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not load cards");
            setCurrentCards([]);
        } finally {
            setLoading(false);
        }
    }

    async function loadFinalRecommendations(cardKey: string) {
        setLoadingRecs(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.set("cardKey", cardKey);

            const data = await api.get<RecommendationItem[]>(`/api/recommendations/final?${params.toString()}`)
            setRecommendations(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not load recommendations");
            setRecommendations([]);
        } finally {
            setLoadingRecs(false);
        }
    }

    async function finishFlow(path: string[]) {
        setFinishedPath(path.join("|"));
        setCurrentCards([]);

        const finalCardKey = path[path.length - 1];

        if (!finalCardKey) {
            setRecommendations([]);
            setError("No final card selected");
            return;
        }

        await loadFinalRecommendations(finalCardKey);
    }

    async function saveToHistory(recommendationId: number, status: "SAVED" | "DISMISSED") {
        try {
            await api.post("/api/history", { recommendationId, status });
            setRecommendations((prev) => prev.filter((r) => r.id !== recommendationId));
        } catch (e) {
            alert(e instanceof Error ? e.message : "Could not save recommendation");
        }
    }

    useEffect(() => {
        loadCards(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSelect(card: PreferenceCard) {
        const newPath = [...selectedPath, card.key];
        setSelectedPath(newPath);

        if (card.level >= FINAL_LEVEL) {
            await finishFlow(newPath);
            return;
        }

        const nextLevel = card.level + 1;
        setCurrentLevel(nextLevel);
        await loadCards(nextLevel, card.key, newPath);
    }

    async function handleDiscard(card: PreferenceCard) {
        const nextCards = currentCards.filter((c) => c.id !== card.id);
        setCurrentCards(nextCards);

        if (nextCards.length > 0) {
            return;
        }

        if (currentLevel === 1) {
            await loadCards(1);
            return;
        }

        if (currentLevel === 2) {
            const parentKeyLevel1 = selectedPath[0];

            if (parentKeyLevel1) {
                await loadCards(2, parentKeyLevel1, selectedPath);
                return;
            }

            await loadCards(1);
            return;
        }

        await finishFlow(selectedPath);
    }

    function resetFlow() {
        setSelectedPath([]);
        setFinishedPath(null);
        setRecommendations([]);
        setCurrentLevel(1);
        setError(null);
        loadCards(1);
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-lg flex flex-col items-center gap-6">
                <div className="text-center space-y-1.5">
                    <h1 className="text-2xl font-bold tracking-tight">Choose your preferences</h1>
                    <p className="text-muted-foreground text-sm">
                        {finishedPath ? "Recommendations ready" : `Level ${currentLevel} of ${FINAL_LEVEL}`}
                    </p>
                    {selectedPath.length > 0 && !finishedPath && (
                        <p className="text-xs text-muted-foreground/60 break-all">
                            Path: {selectedPath.join(" > ")}
                        </p>
                    )}
                </div>

                <div className="relative w-80 h-[520px]">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-72 h-72 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
                    </div>
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-lg font-semibold text-muted-foreground">Loading...</div>
                        </div>
                    )}

                    {!loading && !finishedPath && error && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {!loading && !finishedPath && !error &&
                        currentCards.map((card, index) => (
                            <Card
                                key={card.id}
                                card={card}
                                index={index}
                                totalCards={currentCards.length}
                                onDiscard={() => handleDiscard(card)}
                                onSelect={() => handleSelect(card)}
                            />
                        ))}

                    {finishedPath && (
                        <div className="absolute inset-0 overflow-y-auto rounded-2xl bg-card border p-6 flex flex-col gap-4">
                            <h2 className="text-xl font-bold text-center">Your recommendations</h2>
                            <p className="text-xs text-muted-foreground break-all text-center">
                                Path: {finishedPath}
                            </p>

                            {loadingRecs && (
                                <div className="text-center text-sm text-muted-foreground">Loading recommendations...</div>
                            )}

                            {!loadingRecs && recommendations.length === 0 && (
                                <div className="text-center text-sm text-muted-foreground">
                                    No recommendations found for this path yet.
                                </div>
                            )}

                            {!loadingRecs &&
                                recommendations.map((rec) => (
                                    <div key={rec.id} className="rounded-xl border p-4 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                        <h3 className="text-lg font-semibold">{rec.title}</h3>
                                        <p className="text-xs text-muted-foreground">{rec.type}</p>
                                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => saveToHistory(rec.id, "SAVED")}>Save</Button>
                                            <Button size="sm" variant="outline" onClick={() => saveToHistory(rec.id, "DISMISSED")}>Dismiss</Button>
                                        </div>
                                    </div>
                                ))}

                            <div className="flex gap-2 mt-2">
                                <Button className="flex-1" onClick={resetFlow}>Reset</Button>
                                <Button variant="outline" className="flex-1" onClick={() => router.push("/history")}>Finish</Button>
                            </div>
                        </div>
                    )}
                </div>

                {!finishedPath && !loading && !error && (
                    <p className="text-xs text-muted-foreground text-center">
                        Swipe right to choose &bull; Swipe left to skip
                    </p>
                )}
            </div>
        </main>
    );
}

function Card({
                  card,
                  index,
                  totalCards,
                  onDiscard,
                  onSelect,
              }: {
    card: PreferenceCard;
    index: number;
    totalCards: number;
    onDiscard: () => void;
    onSelect: () => void;
}) {
    const controls = useAnimation();
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

    const isTop = index === totalCards - 1;
    const scale = 1 - (totalCards - 1 - index) * 0.05;
    const yOffset = (totalCards - 1 - index) * 10;

    const handleDragEnd = async (_: unknown, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 80) {
            const direction = info.offset.x > 0 ? 1 : -1;

            await controls.start({
                x: direction * 1000,
                rotate: direction * 45,
                opacity: 0,
                transition: { duration: 0.4 },
            });

            if (direction > 0) {
                onSelect();
            } else {
                onDiscard();
            }
        } else {
            await controls.start({ x: 0, rotate: 0 });
        }
    };

    return (
        <motion.div
            className="absolute inset-0"
            style={{ x, rotate, scale, y: yOffset, zIndex: index }}
            animate={controls}
            drag={isTop ? "x" : false}
            onDragEnd={handleDragEnd}
        >
            <div className={`w-full h-full rounded-2xl border-2 bg-card flex flex-col items-center justify-center gap-3 transition-shadow duration-300 ${isTop ? 'shadow-[0_0_25px_-8px_rgba(102,184,0,0.25)] border-primary/20' : 'shadow-lg'}`}>
                <div className="text-6xl">{card.emoji ?? "🎴"}</div>
                <div className="text-xl font-semibold">{card.label}</div>
            </div>
        </motion.div>
    );
}
