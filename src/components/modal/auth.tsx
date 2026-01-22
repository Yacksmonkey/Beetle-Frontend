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
import { getMe } from "@/services/auth"
import { useRouter } from "next/navigation"
import { GoogleLogin } from "@react-oauth/google"

interface AuthModalProps {
    authModalOpen: boolean
    setAuthModalOpen: (open: boolean) => void
}

export default function AuthModal({ authModalOpen, setAuthModalOpen }: AuthModalProps) {
    const router = useRouter()

    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [notice, setNotice] = useState<string | null>(null)
    const [noticeType, setNoticeType] = useState<"success" | "error" | null>(null)

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

        // ------------------------
        // SIGN UP
        // ------------------------
        if (!isLogin) {
            if (!name.trim()) return setError("Name is required.")
            if (!email.trim()) return setError("Email is required.")
            if (password.length < 8) return setError("Password must be at least 8 characters.")
            if (password !== confirmPassword) return setError("Passwords do not match.")

            setIsSubmitting(true)
            try {
                const res = await fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                })


                const contentType = res.headers.get("content-type") ?? ""
                const data = contentType.includes("application/json")
                    ? await res.json().catch(() => null)
                    : await res.text().catch(() => "")

                if (!res.ok) {
                    const msg =
                        typeof data === "string"
                            ? data
                            : data?.message || "Registration failed."
                    setError(msg || "Registration failed.")
                    return
                }

                setSuccess("Your account has been created successfully. Please log in.")
                setIsLogin(true)
                setPassword("")
                setConfirmPassword("")

                return
            } catch {
                setError("Network error. Is the backend running?")
                return
            } finally {
                setIsSubmitting(false)
            }
        }

        // ------------------------
        // LOGIN NORMAL
        // ------------------------
        if (!email.trim()) return setError("Email is required.")
        if (!password.trim()) return setError("Password is required.")

        setIsSubmitting(true)
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {

                const text = await res.text().catch(() => "")
                setError(text || "Login failed.")
                return
            }

            await getMe()
            setAuthModalOpen(false)
            router.push("/profile")
        } catch {
            setError("Network error. Is the backend running?")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {isLogin ? "Welcome back" : "Create an account"}
                    </DialogTitle>
                    <DialogDescription>
                        {isLogin
                            ? "Welcome back! Please enter your details."
                            : "Sign up to get started with your account."}
                    </DialogDescription>
                </DialogHeader>

                {isLogin && (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-sm hover:underline"
                            onClick={() => {
                                setAuthModalOpen(false)
                                router.push("/forgot-password")
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {!isLogin && (
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    {!isLogin && (
                        <div>
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
                        <p className={`text-sm ${noticeType === "success" ? "text-green-600" : "text-red-500"}`}>
                            {notice}
                        </p>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting
                            ? (isLogin ? "Logging in..." : "Creating account...")
                            : (isLogin ? "Login" : "Create account")}
                    </Button>

                    {isLogin && (
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                setNotice(null)
                                setNoticeType(null)

                                try {
                                    const res = await fetch("http://localhost:8080/api/auth/google", {
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

                                    await getMe()
                                    setAuthModalOpen(false)
                                    router.push("/profile")
                                } catch {
                                    setError("Network error. Is the backend running?")
                                }
                            }}
                            onError={() => {
                                setError("Google login error.")
                            }}
                        />
                    )}

                    <p className="text-center text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            className="hover:underline"
                            onClick={toggleMode}
                            disabled={isSubmitting}
                        >
                            {isLogin ? "Sign up" : "Log in"}
                        </button>
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    )
}
