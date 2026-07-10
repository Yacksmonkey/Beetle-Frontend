"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Heart, Users } from "lucide-react";
import { BeetleLogo } from "@/components/core/beetle-logo";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/modal/auth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

function AboutModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <BeetleLogo className="size-8 text-primary" />
                        <DialogTitle className="text-2xl">About Beetle</DialogTitle>
                    </div>
                    <DialogDescription className="text-base">
                        Beetle helps you discover movies, series, books and music.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                    <div className="flex gap-3 p-4 rounded-xl bg-accent/50">
                        <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-sm">Choose &amp; Discover</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                You choose preference cards and Beetle recommends movies, series, books and music.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 p-4 rounded-xl bg-accent/50">
                        <Heart className="size-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-sm">Save Favorites</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Save the recommendations you love to your personal collection.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 p-4 rounded-xl bg-accent/50">
                        <Users className="size-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-sm">Connect with Friends</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Connect with friends and see their activity on your feed.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function PrivacyModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Privacy</DialogTitle>
                    <DialogDescription className="text-base">
                        How Beetle handles your data.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Beetle is a personal portfolio/demo project. Profile data is used only for app functionality.
                    </p>
                    <p>
                        Authentication uses the existing secure auth flow.
                    </p>
                    <p>
                        No selling user data. Users can update their profile information at any time.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function TermsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Terms</DialogTitle>
                    <DialogDescription className="text-base">
                        Terms of use for Beetle.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Beetle is a demo/portfolio project. Recommendations are for entertainment and discovery purposes.
                    </p>
                    <p>
                        Users are responsible for their interactions.
                    </p>
                    <p>
                        Availability may vary because free hosting is used.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function Footer() {
    const router = useRouter();
    const { isAuthenticated, refreshUser, loading } = useAuth();
    const [aboutOpen, setAboutOpen] = useState(false);
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const requireAuth = (path: string) => {
        if (loading) return;
        if (isAuthenticated) {
            router.push(path);
        } else {
            setAuthModalOpen(true);
        }
    };

    return (
        <>
            <footer className="border-t border-border bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="col-span-2 md:col-span-2">
                            <div className="flex items-center gap-2.5 mb-4">
                                <BeetleLogo className="size-6 text-primary" />
                                <span className="text-lg font-semibold tracking-tight">Beetle</span>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                                Discover your perfect journey through personalized recommendations.
                            </p>
                            <p className="text-xs text-muted-foreground mt-4">
                                Built by Everson Landaeta &middot; Open Source Portfolio
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-4">Product</h4>
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => router.push("/")}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                                    >
                                        Home
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => requireAuth("/cards")}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                                    >
                                        Cards
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => requireAuth("/history")}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                                    >
                                        History
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-4">Resources</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="https://github.com/Yacksmonkey"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.instagram.com/yacksmonkey?igsh=MW1jbnZrMGFoazA4Yw==&utm_source=qr"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://x.com/yacksmonkey?s=11"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        X
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-4">Company</h4>
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => setAboutOpen(true)}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                                    >
                                        About Beetle
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setPrivacyOpen(true)}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                                    >
                                        Privacy
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setTermsOpen(true)}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                                    >
                                        Terms
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Beetle. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            <AboutModal open={aboutOpen} onOpenChange={setAboutOpen} />
            <PrivacyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
            <TermsModal open={termsOpen} onOpenChange={setTermsOpen} />
            <AuthModal
                authModalOpen={authModalOpen}
                setAuthModalOpen={setAuthModalOpen}
                onAuthSuccess={() => {
                    setAuthModalOpen(false);
                    refreshUser();
                }}
            />
        </>
    );
}
