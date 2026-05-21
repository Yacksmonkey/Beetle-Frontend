import { API_BASE } from "@/app/env"

export async function requestPasswordReset(email: string) {
    const res = await fetch(`${API_BASE}/api/password/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })

    const text = await res.text() // backend devuelve String
    if (!res.ok) throw new Error(text || "Request reset failed")
    return text
}

export async function resetPassword(token: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/api/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    })

    const text = await res.text() // backend devuelve String
    if (!res.ok) throw new Error(text || "Reset failed")
    return text
}
