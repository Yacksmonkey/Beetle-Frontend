"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/services/api";

type HistoryItem = {
    historyId: number;
    status: "DRAFT" | "SAVED" | "DISMISSED";
    createdAt: string;
    recommendationId: number;
    type: "MOVIE" | "SERIES" | "MUSIC" | "BOOK";
    title: string;
    description: string;
    imageUrl: string | null;
    externalUrl: string | null;
};

type HistoryResponse = {
    items: HistoryItem[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
};

type CommentItem = {
    id: number;
    userId: number;
    username: string;
    historyId: number;
    content: string;
    createdAt: string;
};

type MeResponse = {
    id: number;
    username: string;
};

export default function HistoryPage() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [me, setMe] = useState<MeResponse | null>(null);
    const [meError, setMeError] = useState<string | null>(null);

    const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
    const [commentsByHistoryId, setCommentsByHistoryId] = useState<Record<number, CommentItem[]>>({});
    const [loadingComments, setLoadingComments] = useState<Record<number, boolean>>({});
    const [showCommentsByHistoryId, setShowCommentsByHistoryId] = useState<Record<number, boolean>>({});
    const [likedByHistoryId, setLikedByHistoryId] = useState<Record<number, boolean>>({});

    async function loadMe() {
        try {
            const data = await api.get<{ id: number; username: string }>("/api/auth/me");
            setMe({
                id: data.id,
                username: data.username,
            });
            setMeError(null);
        } catch {
            setMeError("Could not load user data. Comment deletion unavailable.");
        }
    }

    async function load() {
        setLoading(true);
        setError(null);

        try {
            const data = await api.get<HistoryResponse>("/api/history/me?page=0&size=50");
            setItems(data.items);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error loading history");
        } finally {
            setLoading(false);
        }
    }

    async function remove(historyId: number) {
        try {
            await api.del(`/api/history/${historyId}`);
            setItems((prev) => prev.filter((x) => x.historyId !== historyId));
        } catch (e) {
            alert(e instanceof Error ? e.message : "Could not delete");
        }
    }

    async function like(historyId: number) {
        try {
            const data = await api.post<{ liked: boolean }>(`/api/friends/history/${historyId}/like`);
            setLikedByHistoryId((prev) => ({
                ...prev,
                [historyId]: data.liked,
            }));
        } catch (e) {
            alert(e instanceof Error ? e.message : "Could not toggle like");
        }
    }

    async function loadComments(historyId: number) {
        try {
            setLoadingComments((prev) => ({ ...prev, [historyId]: true }));
            const data = await api.get<CommentItem[]>(`/api/comments/${historyId}`);
            setCommentsByHistoryId((prev) => ({ ...prev, [historyId]: data }));
        } catch (e) {
            alert(e instanceof Error ? e.message : "Could not load comments");
        } finally {
            setLoadingComments((prev) => ({ ...prev, [historyId]: false }));
        }
    }

    async function toggleComments(historyId: number) {
        const isOpen = !!showCommentsByHistoryId[historyId];

        if (isOpen) {
            setShowCommentsByHistoryId((prev) => ({
                ...prev,
                [historyId]: false,
            }));
            return;
        }

        await loadComments(historyId);

        setShowCommentsByHistoryId((prev) => ({
            ...prev,
            [historyId]: true,
        }));
    }

    async function addComment(historyId: number) {
        const content = commentInputs[historyId]?.trim();

        if (!content) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            await api.post("/api/comments", { historyId, content });
            setCommentInputs((prev) => ({ ...prev, [historyId]: "" }));
            await loadComments(historyId);

            setShowCommentsByHistoryId((prev) => ({
                ...prev,
                [historyId]: true,
            }));
        } catch (e) {
            alert(e instanceof Error ? e.message : "Could not add comment");
        }
    }

    async function deleteComment(historyId: number, commentId: number) {
        try {
            await api.del(`/api/comments/${commentId}`);
            await loadComments(historyId);
        } catch (e) {
            alert(e instanceof Error ? e.message : "Could not delete comment");
        }
    }

    useEffect(() => {
        load();
        loadMe();
    }, []);

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="mx-auto max-w-4xl space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">My History</h1>
                        <p className="text-sm text-muted-foreground">Your saved recommendations</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                        Refresh
                    </Button>
                </div>

                {meError && (
                    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">{meError}</p>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-12 text-sm text-muted-foreground">
                        Loading...
                    </div>
                )}

                {!loading && error && (
                    <Card>
                        <div className="p-6">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    </Card>
                )}

                {!loading && !error && items.length === 0 && (
                    <Card>
                        <div className="p-6 text-center">
                            <p className="text-sm text-muted-foreground">No history yet.</p>
                        </div>
                    </Card>
                )}

                <div className="space-y-4">
                    {items.map((it) => (
                        <Card key={it.historyId}>
                            <div className="p-6 space-y-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex gap-2 items-center">
                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-muted-foreground">
                                                {it.type}
                                            </span>
                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-muted-foreground">
                                                {it.status}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-semibold tracking-tight">{it.title}</h2>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {it.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Button
                                            variant={likedByHistoryId[it.historyId] ? "default" : "secondary"}
                                            size="sm"
                                            onClick={() => like(it.historyId)}
                                        >
                                            {likedByHistoryId[it.historyId] ? "Liked" : "Like"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => remove(it.historyId)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                {it.externalUrl && (
                                    <a
                                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                        href={it.externalUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Open link &rarr;
                                    </a>
                                )}

                                <div className="space-y-3 pt-3 border-t border-border">
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="Write a comment..."
                                            value={commentInputs[it.historyId] ?? ""}
                                            onChange={(e) =>
                                                setCommentInputs((prev) => ({
                                                    ...prev,
                                                    [it.historyId]: e.target.value,
                                                }))
                                            }
                                        />
                                        <Button size="sm" onClick={() => addComment(it.historyId)}>
                                            Comment
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleComments(it.historyId)}
                                            disabled={loadingComments[it.historyId]}
                                        >
                                            {loadingComments[it.historyId]
                                                ? "Loading..."
                                                : showCommentsByHistoryId[it.historyId]
                                                    ? "Hide"
                                                    : "Show"}
                                        </Button>
                                    </div>

                                    {showCommentsByHistoryId[it.historyId] &&
                                        commentsByHistoryId[it.historyId] &&
                                        commentsByHistoryId[it.historyId].length > 0 && (
                                            <div className="space-y-2">
                                                {commentsByHistoryId[it.historyId].map((comment) => (
                                                    <div
                                                        key={comment.id}
                                                        className="rounded-lg border p-3 flex items-start justify-between gap-3"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium">@{comment.username || "unknown"}</p>
                                                            <p className="text-sm text-muted-foreground mt-0.5">{comment.content}</p>
                                                        </div>
                                                        {me && me.id === comment.userId && (
                                                            <Button variant="outline" size="sm" onClick={() => deleteComment(it.historyId, comment.id)}>
                                                                Delete
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    {showCommentsByHistoryId[it.historyId] &&
                                        commentsByHistoryId[it.historyId] &&
                                        commentsByHistoryId[it.historyId].length === 0 && (
                                            <p className="text-sm text-muted-foreground">No comments yet.</p>
                                        )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
