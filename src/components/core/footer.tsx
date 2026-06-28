"use client"

import React, { useState } from "react";
import { Github, Twitter, Heart, Sparkles, Users, MessageCircle } from "lucide-react";
import { BeetleLogo } from "@/components/core/beetle-logo";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const footerLinks = {
    product: [
        { name: "Cards", href: "/cards" },
        { name: "History", href: "/history" },
        { name: "Recommendations", href: "#" },
    ],
    resources: [
        { name: "Help Center", href: "#" },
        { name: "GitHub", href: "#" },
        { name: "Contact", href: "#" },
    ],
    legal: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
    ],
};

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
                        Discover recommendations that truly match your taste.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="flex gap-3 p-4 rounded-xl bg-accent/50">
                        <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-sm">Recommendation Cards</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Swipe through beautifully designed cards to tell us what you love. Each choice refines your profile.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 p-4 rounded-xl bg-accent/50">
                        <Heart className="size-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-sm">Personalized Discovery</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Your preferences shape unique recommendations across movies, series, music, and books.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 p-4 rounded-xl bg-accent/50">
                        <Users className="size-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-sm">Friend Interactions</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Connect with friends, share what you discover, and see their activity on your feed.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 p-4 rounded-xl bg-accent/50">
                        <MessageCircle className="size-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-sm">Why Beetle</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Built to help you find your next favorite thing — without endless scrolling.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function Footer() {
    const [aboutOpen, setAboutOpen] = useState(false);

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
                                Discover your perfect journey through personalized recommendations powered by your choices.
                            </p>
                            <div className="flex items-center gap-3 mt-5">
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                                    <Twitter className="size-4" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                                    <Github className="size-4" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-4">Product</h4>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-4">Resources</h4>
                            <ul className="space-y-3">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
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
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
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
        </>
    );
}
