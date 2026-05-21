"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { API_BASE } from "@/app/env"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token") // viene del link del email: /reset-password?token=...

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [error, setError] = useState("")
    const [resultMsg, setResultMsg] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setResultMsg(null)

        if (!token) {
            setError("Missing token. Please use the reset link from your email.")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setShowDialog(true)
    }

    const handleConfirm = async () => {
        setShowDialog(false)
        setIsLoading(true)
        setError("")
        setResultMsg(null)

        if (!token) {
            setError("Missing token. Please use the reset link from your email.")
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch(`${API_BASE}/api/password/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            })

            const text = await res.text()


            if (text.startsWith("Error:")) {
                setError(text)
                return
            }

            setResultMsg(text) // "Password successfully reset for user: ..."

            // Redirige a login (recomendado) o a donde quieras:
            router.push("/")
        } catch {
            setError("Network error. Is the backend running?")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Reset password</h1>
                    <p className="text-sm text-muted-foreground">
                        Please enter your new password. It must be at least 8 characters and both fields must match.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {resultMsg && <p className="text-sm text-green-600">{resultMsg}</p>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </form>

                <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Do you want to change your password? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoading}>No</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
                                Yes
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
