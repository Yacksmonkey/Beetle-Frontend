"use client"

import { FormEvent, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login as authLogin, register as authRegister } from "@/services/auth"
import { useRouter } from "next/navigation"
import { GoogleLogin } from "@react-oauth/google"
import { BeetleLogo } from "@/components/core/beetle-logo"
import { BackendWakeOverlay } from "@/components/backend-wake-overlay"

interface AuthModalProps {
    authModalOpen: boolean
    setAuthModalOpen: (open: boolean) => void
    onAuthSuccess?: () => void
}

export default function AuthModal({ authModalOpen, setAuthModalOpen, onAuthSuccess }: AuthModalProps) {
    const router = useRouter()

    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [notice, setNotice] = useState<string | null>(null)
    const [noticeType, setNoticeType] = useState<"success" | "error" | null>(null)
    const [authActive, setAuthActive] = useState(false)

    const resetFields = () => {
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
    }

    const toggleMode = () => {
        setIsLogin((prev) => !prev)
        resetFields()
        setNotice(null)
        setNoticeType(null)

    }

    const setError = (msg: string) => {
        setNotice(msg)
        setNoticeType("error")
    }

    const setSuccess = (msg: string) => {
        setNotice(msg)
        setNoticeType("success")
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isSubmitting) return

        setNotice(null)
        setNoticeType(null)

        if (!isLogin) {
            if (!name.trim()) return setError("Name is required.")
            if (!email.trim()) return setError("Email is required.")
            if (password.length < 8) return setError("Password must be at least 8 characters.")
            if (password !== confirmPassword) return setError("Passwords do not match.")

            setIsSubmitting(true)
            setAuthActive(true)
            try {
                const data = await authRegister(name, email, password)

                if (data?.userId) {
                    onAuthSuccess?.()
                    setAuthModalOpen(false)
                    router.push("/profile")
                    return
                }

                setSuccess("Your account has been created successfully. Please log in.")
                setIsLogin(true)
                setPassword("")
                setConfirmPassword("")

                return
            } catch (err) {
                setError(err instanceof Error ? err.message : "Registration failed.")
                return
            } finally {
                setAuthActive(false)
                setIsSubmitting(false)
            }
        }

        if (!email.trim()) return setError("Email is required.")
        if (!password.trim()) return setError("Password is required.")

        setIsSubmitting(true)
        setAuthActive(true)
        try {
            await authLogin(email, password)
            onAuthSuccess?.()
            setAuthModalOpen(false)
            router.push("/profile")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed.")
        } finally {
            setAuthActive(false)
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <BeetleLogo className="size-7 text-primary" />
                            <DialogTitle className="text-2xl font-bold tracking-tight">
                                {isLogin ? "Welcome back" : "Create an account"}
                            </DialogTitle>
                        </div>
                        <DialogDescription>
                            {isLogin
                                ? "Enter your details to sign in."
                                : "Sign up to get started."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <Label>Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label>Password</Label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => {
                                            setAuthModalOpen(false)
                                            router.push("/forgot-password")
                                        }}
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}

                        {notice && (
                            <p className={`text-sm ${noticeType === "success" ? "text-primary" : "text-destructive"}`}>
                                {notice}
                            </p>
                        )}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting
                                ? (isLogin ? "Signing in..." : "Creating account...")
                                : (isLogin ? "Sign in" : "Create account")}
                        </Button>

                        {isLogin && (
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        setNotice(null)
                                        setNoticeType(null)

                                        setAuthActive(true)
                                        try {
                                            const res = await fetch(`/api/auth/google`, {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                credentials: "include",
                                                body: JSON.stringify({
                                                    googleToken: credentialResponse.credential,
                                                }),
                                            })

                                            if (!res.ok) {
                                                const text = await res.text().catch(() => "")
                                                setError(text || "Google login failed.")
                                                return
                                            }

                                            onAuthSuccess?.()
                                            setAuthModalOpen(false)
                                            router.push("/profile")
                                        } catch {
                                            setError("Network error. Is the backend running?")
                                        } finally {
                                            setAuthActive(false)
                                        }
                                    }}
                                    onError={() => {
                                        setError("Google login error.")
                                    }}
                                />
                            </div>
                        )}

                        <p className="text-center text-sm text-muted-foreground">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                className="text-foreground font-medium hover:underline"
                                onClick={toggleMode}
                                disabled={isSubmitting}
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </form>
                </DialogContent>
            </Dialog>
            <BackendWakeOverlay active={authActive} />
        </>
    )
}
