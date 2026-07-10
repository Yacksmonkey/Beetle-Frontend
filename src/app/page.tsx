"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Compass, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/services/auth"
import { api } from "@/services/api"
import AuthModal from "@/components/modal/auth"
import { BeetleLogo } from "@/components/core/beetle-logo"

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
    const router = useRouter()
    const [me, setMe] = useState<unknown>(null)
    const [authChecked, setAuthChecked] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)

    const [feedItems, setFeedItems] = useState<FeedItem[]>([])
    const [feedLoading, setFeedLoading] = useState(true)
    const [feedError, setFeedError] = useState<string | null>(null)

    useEffect(() => {
        checkAuth()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function checkAuth() {
        const user = await getCurrentUser()
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

            const data = await api.get<FeedResponse>("/api/history/feed?page=0&size=10")
            setFeedItems(data.items || [])
        } catch (e) {
            setFeedError(e instanceof Error ? e.message : "Could not load feed")
            setFeedItems([])
        } finally {
            setFeedLoading(false)
        }
    }

    return (
        <div className="min-h-screen">
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <Sparkles className="size-4" />
                                Personalized recommendations
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                                Discover your
                                <br />
                                <span className="text-primary">perfect journey</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                                Tell us what you love through simple cards. We&apos;ll find the best movies, series, music, and books just for you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    size="xl"
                                    onClick={() => { if (!authChecked) return; if (me) router.push("/cards"); else setAuthModalOpen(true); }}
                                >
                                    Start Journey
                                    <ArrowRight className="ml-1.5 size-5" />
                                </Button>
                                <Button
                                    size="xl"
                                    variant="outline"
                                    onClick={() => { if (!authChecked) return; if (me) router.push("/history"); else setAuthModalOpen(true); }}
                                >
                                    Explore Cards
                                </Button>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
                                <BeetleLogo className="size-64 text-primary/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BeetleLogo className="size-48 text-primary/40" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BeetleLogo className="size-32 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-border bg-accent/30 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[800px] h-[800px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-card border border-border rounded-xl p-8 space-y-4">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="size-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">Personalized</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Your preferences create a unique profile. Every recommendation is tailored to what you truly enjoy.
                            </p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-8 space-y-4">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Compass className="size-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">Discover</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Explore new movies, series, music, and books you would never have found on your own.
                            </p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-8 space-y-4">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Users className="size-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">Connect</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Share discoveries with friends and see what they are enjoying in your feed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PUBLIC ABOUT — only for unauthenticated users */}
            {authChecked && !me && (
                <section className="relative overflow-hidden py-20">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[600px] h-[600px] rounded-full bg-primary/5 dark:bg-primary/[0.07] blur-3xl" />
                    </div>
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-12 space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <BeetleLogo className="size-4" />
                                About Beetle
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                Your personal discovery engine
                            </h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                                Five simple steps to find what you&apos;ll love next.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { num: "01", title: "Choose Cards", desc: "Pick what you like from simple preference cards" },
                                { num: "02", title: "Get Recommendations", desc: "Beetle finds movies, series, books and music for you" },
                                { num: "03", title: "Save to History", desc: "Keep the best ones in your personal collection" },
                                { num: "04", title: "Connect with Friends", desc: "See what friends are discovering and sharing" },
                                { num: "05", title: "Build Your Profile", desc: "Your taste profile grows with every choice" },
                            ].map((step, i) => (
                                <div
                                    key={i}
                                    className="relative bg-card border border-border rounded-xl p-5 space-y-2 text-center group hover:border-primary/20 transition-colors"
                                >
                                    {i < 4 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border z-10" />
                                    )}
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                                        <span className="text-sm font-bold text-primary">{step.num}</span>
                                    </div>
                                    <h3 className="font-semibold text-sm">{step.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {authChecked && !!me && (
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight">Friends Feed</h2>
                                <p className="text-muted-foreground text-sm">
                                    See what your friends are saving lately.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={loadFeed} disabled={feedLoading}>
                                Refresh
                            </Button>
                        </div>

                        {feedLoading && (
                            <div className="text-center py-12 text-sm text-muted-foreground">
                                Loading feed...
                            </div>
                        )}

                        {!feedLoading && feedError && (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground">Error loading feed</p>
                                </CardContent>
                            </Card>
                        )}

                        {!feedLoading && !feedError && feedItems.length === 0 && (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground">
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
                                                        src={item.picture || "/beetle insect.jpg"}
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
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-muted-foreground">
                                                    {item.type}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                            </div>
                                            {item.externalUrl && (
                                                <a
                                                    className="text-sm text-primary hover:underline"
                                                    href={item.externalUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Open link &rarr;
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
            <AuthModal authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen} onAuthSuccess={() => { setAuthModalOpen(false); checkAuth() }} />
        </div>
    )
}
