"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { getMe } from "@/services/auth"

type FeedItem = {
    historyId: number
    userId: number
    username: string
    picture: string | null
    createdAt: string
    recommendationId: number
    type: "MOVIE" | "SERIES" | "MUSIC" | "BOOK"
    title: string
    description: string
    imageUrl: string | null
    externalUrl: string | null
}

type FeedResponse = {
    items: FeedItem[]
    page: number
    size: number
    totalItems: number
    totalPages: number
}

export default function Home() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    const [me, setMe] = useState<any>(null)
    const [authChecked, setAuthChecked] = useState(false)

    const [feedItems, setFeedItems] = useState<FeedItem[]>([])
    const [feedLoading, setFeedLoading] = useState(true)
    const [feedError, setFeedError] = useState<string | null>(null)

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

    useEffect(() => {
        setMounted(true)
        checkAuth()
    }, [])

    const isDark = mounted && theme === "dark"

    async function checkAuth() {
        const user = await getMe()
        setMe(user)
        setAuthChecked(true)

        if (user) {
            loadFeed()
        } else {
            setFeedLoading(false)
        }
    }

    async function loadFeed() {
        try {
            setFeedLoading(true)
            setFeedError(null)

            const res = await fetch(`${API_BASE}/api/history/feed?page=0&size=10`, {
                method: "GET",
                credentials: "include",
            })

            if (!res.ok) {
                throw new Error("Failed to load feed")
            }

            const data: FeedResponse = await res.json()
            setFeedItems(data.items || [])
        } catch (e: any) {
            setFeedError(e?.message ?? "Could not load feed")
            setFeedItems([])
        } finally {
            setFeedLoading(false)
        }
    }

    return (
        <div className="min-h-screen">
            <div className="relative h-screen w-full mt-5">
                <div className="absolute inset-0 flex items-center justify-center md:justify-start pointer-events-none">
                    <div className="text-center space-y-6 px-4 pointer-events-auto">
                        <div className="inline-block">
                            <h1 className="text-6xl md:text-8xl font-bold">
                                <span className="text-primary">Welcome to</span>
                            </h1>
                            <h1 className="text-6xl md:text-8xl font-bold mt-2">
                                <span className="text-primary">Bettle</span>
                            </h1>
                        </div>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                            Build your perfect plan by selecting cards. Your journey starts here.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Start Your Journey
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>

                            <Button size="lg" variant="outline">
                                Explore Cards
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-background">
                {authChecked && me && (
                    <section className="py-16 px-4 border-y border-border">
                        <div className="max-w-5xl mx-auto space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold">Friends Feed</h2>
                                    <p className="text-muted-foreground">
                                        See what your friends are saving lately.
                                    </p>
                                </div>

                                <Button variant="outline" onClick={loadFeed} disabled={feedLoading}>
                                    Refresh
                                </Button>
                            </div>

                            {feedLoading && (
                                <p className="text-sm text-muted-foreground">Loading feed...</p>
                            )}

                            {!feedLoading && feedError && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <p>Error loading feed</p>
                                    </CardContent>
                                </Card>
                            )}

                            {!feedLoading && !feedError && feedItems.length === 0 && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-muted-foreground">
                                            No activity from friends yet.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {!feedLoading && !feedError && feedItems.length > 0 && (
                                <div className="space-y-4">
                                    {feedItems.map((item) => (
                                        <Card key={item.historyId}>
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={item.picture || "/bettle insect.jpg"}
                                                            alt={item.username}
                                                            className="w-10 h-10 rounded-full object-cover border"
                                                        />

                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">
                                                                @{item.username}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                Friend activity
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <span className="border px-2 py-0.5 rounded text-xs">
                                                        {item.type}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-semibold">
                                                        {item.title}
                                                    </h3>

                                                    <p className="text-muted-foreground mt-1">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {item.externalUrl && (
                                                    <a
                                                        className="text-sm underline"
                                                        href={item.externalUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Open link
                                                    </a>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <section className="py-24 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-4">
                            Plan Your Journey with Cards
                        </h2>
                        <p className="text-muted-foreground">
                            Select, combine, and customize cards to create your plan
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}