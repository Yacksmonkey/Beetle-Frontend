import { API_BASE } from "@/app/env"

export async function getMe() {
    try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            method: "GET",
            credentials: "include",
        })

        if (!res.ok) {
            throw new Error("Not authenticated")
        }

        return res.json()
    } catch {
        throw new Error("Not authenticated")
    }
}
