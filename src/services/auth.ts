export type UserProfile = {
    id?: number
    name?: string
    username?: string
    email?: string
    picture?: string
    phone?: string
    address?: string
    bio?: string
    publicProfile?: boolean
    roles?: string[]
}

export async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || "Login failed")
    }

    return res.json()
}

export async function register(name: string, email: string, password: string) {
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
                : data?.message || "Registration failed"
        throw new Error(msg)
    }

    return data
}

export async function logout() {
    const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
    })

    if (!res.ok) {
        throw new Error("Logout failed")
    }

    return res.json()
}

export async function getCurrentUser(): Promise<UserProfile | null> {
    try {
        const res = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
        })
        if (res.status === 401) return null
        if (res.ok) return res.json()
        return null
    } catch {
        return null
    }
}
