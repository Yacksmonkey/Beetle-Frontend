"use client"

import { useEffect, useRef, useState } from "react"
import { BeetleLogo } from "@/components/core/beetle-logo"

const MESSAGES = [
    "Connecting to Beetle...",
    "Initializing services...",
    "Loading recommendations...",
    "Almost ready...",
]

export function BackendWakeOverlay({ active }: { active: boolean }) {
    const [visible, setVisible] = useState(false)
    const [fading, setFading] = useState(false)
    const [msgIdx, setMsgIdx] = useState(0)
    const timers = useRef({
        show: null as ReturnType<typeof setTimeout> | null,
        fade: null as ReturnType<typeof setTimeout> | null,
        msg: null as ReturnType<typeof setInterval> | null,
    })
    const wasActive = useRef(false)

    useEffect(() => {
        const t = timers.current
        if (t.show) { clearTimeout(t.show); t.show = null }
        if (t.fade) { clearTimeout(t.fade); t.fade = null }

        if (active && !wasActive.current) {
            setFading(false)
            t.show = setTimeout(() => setVisible(true), 1200)
        } else if (!active && wasActive.current && visible) {
            setFading(true)
            t.fade = setTimeout(() => {
                setVisible(false)
                setFading(false)
            }, 300)
        } else if (!active) {
            setVisible(false)
            setFading(false)
        }

        wasActive.current = active

        return () => {
            if (t.show) clearTimeout(t.show)
            if (t.fade) clearTimeout(t.fade)
        }
    }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const t = timers.current
        if (visible && !fading) {
            setMsgIdx(0)
            t.msg = setInterval(() => setMsgIdx((i) => (i + 1) % MESSAGES.length), 3000)
        }
        return () => {
            if (t.msg) { clearInterval(t.msg); t.msg = null }
        }
    }, [visible, fading])

    if (!visible) return null

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out ${fading ? "opacity-0" : "opacity-100"}`}
            style={{
                background: "radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.92) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
            }}
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-sm">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-[1.5px] border-primary/20 border-t-primary animate-spin" />
                    <div className="absolute inset-3 rounded-full bg-primary/10 blur-xl animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BeetleLogo className="size-12 text-primary" />
                    </div>
                </div>

                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Preparing your experience
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Beetle is waking up. The first visit may take a couple of minutes.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                            style={{
                                animation: `dot-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                            }}
                        />
                    ))}
                </div>

                <div className="h-5 flex items-center">
                    <p
                        key={msgIdx}
                        className="text-sm text-muted-foreground/80"
                        style={{ animation: "overlay-fade-in 0.3s ease-out" }}
                    >
                        {MESSAGES[msgIdx]}
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes dot-pulse {
                    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                    40% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes overlay-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    )
}
