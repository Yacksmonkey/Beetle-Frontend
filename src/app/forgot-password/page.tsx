"use client"

import { useState } from "react"
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

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [showDialog, setShowDialog] = useState(false)
    const [resultMsg, setResultMsg] = useState<string | null>(null)
    const [error, setError] = useState<string>("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setResultMsg(null)

        if (!email.trim()) {
            setError("Please enter your email.")
            return
        }

        setShowDialog(true)
    }

    const handleConfirm = async () => {
        setShowDialog(false)
        setIsLoading(true)
        setError("")
        setResultMsg(null)

        try {
            const res = await fetch("http://localhost:8080/api/password/request-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const text = await res.text()


            // "Error: User with this email not found."
            if (text.startsWith("Error:")) {
                setError(text)
                return
            }


            setResultMsg(text) // "Password reset email sent successfully to: ..."
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
                    <h1 className="text-2xl font-bold">Forgot password</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and we’ll send you a reset token/link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {resultMsg && <p className="text-sm text-green-600">{resultMsg}</p>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send reset email"}
                    </Button>
                </form>

                <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm</AlertDialogTitle>
                            <AlertDialogDescription>
                                Send a password reset request to: <b>{email}</b> ?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
                                Yes, send
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
