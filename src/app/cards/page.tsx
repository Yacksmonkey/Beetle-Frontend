"use client";

import { useEffect, useState } from "react";
import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/core/navbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
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

            const res = await fetch(`${API_BASE}/api/preferences/cards?${params.toString()}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Failed: ${res.status}`);
            }

            const data: PreferenceCard[] = await res.json();

            if (data.length === 0) {
                await finishFlow(fallbackPath ?? selectedPath);
                return;
            }

            setCurrentCards(data);
        } catch (e: any) {
            setError(e?.message ?? "Could not load cards");
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

            const res = await fetch(`${API_BASE}/api/recommendations/final?${params.toString()}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Failed: ${res.status}`);
            }

            const data: RecommendationItem[] = await res.json();
            setRecommendations(data);
        } catch (e: any) {
            setError(e?.message ?? "Could not load recommendations");
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
            const res = await fetch(`${API_BASE}/api/history`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recommendationId,
                    status,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Failed: ${res.status}`);
            }

            setRecommendations((prev) => prev.filter((r) => r.id !== recommendationId));
        } catch (e: any) {
            alert(e?.message ?? "Could not save recommendation");
        }
    }

    useEffect(() => {
        loadCards(1);
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

        // Reiniciar mazo en nivel 1
        if (currentLevel === 1) {
            await loadCards(1);
            return;
        }

        // Reiniciar mazo en nivel 2 usando la selección del nivel 1
        if (currentLevel === 2) {
            const parentKeyLevel1 = selectedPath[0];

            if (parentKeyLevel1) {
                await loadCards(2, parentKeyLevel1, selectedPath);
                return;
            }

            await loadCards(1);
            return;
        }

        // Desde nivel 3 en adelante: mantener flujo actual
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
        <main className="min-h-screen bg-gradient-to-br from-secondary via-card to-background flex items-center justify-center p-4 overflow-hidden">
            <Navbar />

            <div className="w-full max-w-md flex flex-col items-center gap-4">
                <div className="text-center space-y-1">
                    <h1 className="text-white text-2xl font-bold">Choose your preferences</h1>

                    <p className="text-gray-400 text-sm">
                        {finishedPath ? "Recommendations ready" : `Level ${currentLevel} of ${FINAL_LEVEL}`}
                    </p>

                    {selectedPath.length > 0 && !finishedPath && (
                        <p className="text-xs text-gray-500 break-all">
                            Path: {selectedPath.join(" > ")}
                        </p>
                    )}
                </div>

                <div className="relative w-80 h-[500px]">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-xl font-semibold">Loading...</div>
                        </div>
                    )}

                    {!loading &&
                        !finishedPath &&
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
                        <div className="absolute inset-0 overflow-y-auto rounded-2xl bg-card border p-4 flex flex-col gap-4">
                            <h2 className="text-white text-2xl font-bold text-center">Your recommendations</h2>

                            <p className="text-xs text-gray-500 break-all text-center">
                                Path: {finishedPath}
                            </p>

                            {loadingRecs && (
                                <div className="text-white text-center">Loading recommendations...</div>
                            )}

                            {!loadingRecs && recommendations.length === 0 && (
                                <div className="text-center text-gray-400 text-sm">
                                    No recommendations found for this path yet.
                                </div>
                            )}

                            {!loadingRecs &&
                                recommendations.map((rec) => (
                                    <div key={rec.id} className="rounded-xl border p-4 bg-zinc-900/60">
                                        <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{rec.type}</p>
                                        <p className="text-sm text-gray-300 mt-2">{rec.description}</p>

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded text-sm"
                                                onClick={() => saveToHistory(rec.id, "SAVED")}
                                            >
                                                Save
                                            </button>

                                            <button
                                                className="bg-muted text-white hover:bg-muted/80 px-3 py-2 rounded text-sm"
                                                onClick={() => saveToHistory(rec.id, "DISMISSED")}
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            <div className="flex gap-2 mt-2">
                                <button
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded font-medium"
                                    onClick={resetFlow}
                                >
                                    Reset
                                </button>

                                <button
                                    className="flex-1 bg-muted text-white hover:bg-muted/80 px-4 py-2 rounded font-medium"
                                    onClick={() => router.push("/")}
                                >
                                    Finish
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-xs text-gray-500 text-center">
                    Swipe right to choose • Swipe left to skip
                </div>

                {error && (
                    <div className="text-red-400 text-sm text-center max-w-sm">
                        {error}
                    </div>
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

    const handleDragEnd = async (_: any, info: PanInfo) => {
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
            <div className="w-full h-full rounded-2xl border bg-card flex flex-col items-center justify-center">
                <div className="text-6xl">{card.emoji ?? "🎴"}</div>
                <div className="text-white text-2xl font-bold mt-2">{card.label}</div>
            </div>
        </motion.div>
    );
}