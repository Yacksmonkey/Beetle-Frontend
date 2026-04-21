"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function HistoryPage() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [me, setMe] = useState<MeResponse | null>(null);

    const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
    const [commentsByHistoryId, setCommentsByHistoryId] = useState<Record<number, CommentItem[]>>({});
    const [loadingComments, setLoadingComments] = useState<Record<number, boolean>>({});
    const [showCommentsByHistoryId, setShowCommentsByHistoryId] = useState<Record<number, boolean>>({});
    const [likedByHistoryId, setLikedByHistoryId] = useState<Record<number, boolean>>({});

    async function loadMe() {
        try {
            const res = await fetch(`${API_BASE}/api/auth/me`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to load me");
            }

            const data = await res.json();
            setMe({
                id: data.id,
                username: data.username,
            });
        } catch (e) {
            console.error(e);
            setMe(null);
        }
    }

    async function load() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/api/history/me?page=0&size=50`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Failed: ${res.status}`);
            }

            const data: HistoryResponse = await res.json();
            setItems(data.items);
        } catch (e: any) {
            setError(e?.message ?? "Error loading history");
        } finally {
            setLoading(false);
        }
    }

    async function remove(historyId: number) {
        try {
            const res = await fetch(`${API_BASE}/api/history/${historyId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Failed: ${res.status}`);
            }

            setItems((prev) => prev.filter((x) => x.historyId !== historyId));
        } catch (e: any) {
            alert(e?.message ?? "Could not delete");
        }
    }

    async function like(historyId: number) {
        try {
            const res = await fetch(`${API_BASE}/api/friends/history/${historyId}/like`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || `Failed: ${res.status}`);
            }

            setLikedByHistoryId((prev) => ({
                ...prev,
                [historyId]: data.liked,
            }));
        } catch (e: any) {
            alert(e?.message ?? "Could not toggle like");
        }
    }

    async function loadComments(historyId: number) {
        try {
            setLoadingComments((prev) => ({ ...prev, [historyId]: true }));

            const res = await fetch(`${API_BASE}/api/comments/${historyId}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Failed: ${res.status}`);
            }

            const data: CommentItem[] = await res.json();
            setCommentsByHistoryId((prev) => ({ ...prev, [historyId]: data }));
        } catch (e: any) {
            alert(e?.message ?? "Could not load comments");
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
            const res = await fetch(`${API_BASE}/api/comments`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    historyId,
                    content,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || `Failed: ${res.status}`);
            }

            setCommentInputs((prev) => ({ ...prev, [historyId]: "" }));
            await loadComments(historyId);

            setShowCommentsByHistoryId((prev) => ({
                ...prev,
                [historyId]: true,
            }));
        } catch (e: any) {
            alert(e?.message ?? "Could not add comment");
        }
    }

    async function deleteComment(historyId: number, commentId: number) {
        try {
            const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || `Failed: ${res.status}`);
            }

            await loadComments(historyId);
        } catch (e: any) {
            alert(e?.message ?? "Could not delete comment");
        }
    }

    useEffect(() => {
        load();
        loadMe();
    }, []);

    return (
        <div className="mx-auto max-w-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">My History</h1>
                <Button variant="outline" onClick={load} disabled={loading}>
                    Refresh
                </Button>
            </div>

            {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

            {!loading && error && (
                <div className="rounded-lg border p-4">
                    <p className="text-sm">Error: {error}</p>
                </div>
            )}

            {!loading && !error && items.length === 0 && (
                <p className="text-sm text-muted-foreground">No history yet.</p>
            )}

            <div className="space-y-3">
                {items.map((it) => (
                    <div key={it.historyId} className="rounded-xl border p-4 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="flex gap-2 items-center">
                                    <span className="text-xs rounded-full border px-2 py-0.5">
                                        {it.type}
                                    </span>
                                    <span className="text-xs rounded-full border px-2 py-0.5">
                                        {it.status}
                                    </span>
                                </div>

                                <h2 className="text-lg font-medium mt-2">{it.title}</h2>

                                <p className="text-sm text-muted-foreground mt-1">
                                    {it.description}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    className={
                                        likedByHistoryId[it.historyId]
                                            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                            : "bg-muted text-white hover:bg-muted/80"
                                    }
                                    onClick={() => like(it.historyId)}
                                >
                                    {likedByHistoryId[it.historyId] ? "Liked" : "Like"}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-muted text-muted-foreground hover:bg-muted hover:text-white"
                                    onClick={() => remove(it.historyId)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>

                        {it.externalUrl && (
                            <a
                                className="text-sm underline"
                                href={it.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open link
                            </a>
                        )}

                        <div className="space-y-3 border-t pt-3">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                                    placeholder="Write a comment..."
                                    value={commentInputs[it.historyId] ?? ""}
                                    onChange={(e) =>
                                        setCommentInputs((prev) => ({
                                            ...prev,
                                            [it.historyId]: e.target.value,
                                        }))
                                    }
                                />

                                <Button onClick={() => addComment(it.historyId)}>
                                    Comment
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => toggleComments(it.historyId)}
                                    disabled={loadingComments[it.historyId]}
                                >
                                    {loadingComments[it.historyId]
                                        ? "Loading..."
                                        : showCommentsByHistoryId[it.historyId]
                                            ? "Hide comments"
                                            : "Show comments"}
                                </Button>
                            </div>

                            {showCommentsByHistoryId[it.historyId] &&
                                commentsByHistoryId[it.historyId] &&
                                commentsByHistoryId[it.historyId].length > 0 && (
                                    <div className="space-y-2">
                                        {commentsByHistoryId[it.historyId].map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="rounded-md border p-2 flex items-start justify-between gap-3"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        @{comment.username || "unknown"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {comment.content}
                                                    </p>
                                                </div>

                                                {me && me.id === comment.userId && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => deleteComment(it.historyId, comment.id)}
                                                    >
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
                ))}
            </div>
        </div>
    );
}