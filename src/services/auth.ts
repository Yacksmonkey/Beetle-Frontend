import { API_BASE } from "@/app/env";

export async function getMe() {
    try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            method: 'GET',
            credentials: 'include',
        })

        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}
