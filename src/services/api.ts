export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "ApiError"
        this.status = status
    }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `/api/backend${path}`

    const res = await fetch(url, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    })

    if (!res.ok) {
        let message: string
        try {
            const contentType = res.headers.get("content-type") ?? ""
            if (contentType.includes("application/json")) {
                const data = await res.json()
                message = data?.message || data?.error || `Request failed`
            } else {
                message = await res.text()
            }
        } catch {
            message = `Request failed with status ${res.status}`
        }

        throw new ApiError(message || `Request failed with status ${res.status}`, res.status)
    }

    const contentType = res.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) {
        return res.json()
    }

    return undefined as unknown as T
}

export const api = {
    get<T = unknown>(path: string) {
        return request<T>(path, { method: "GET" })
    },

    post<T = unknown>(path: string, body?: unknown) {
        return request<T>(path, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        })
    },

    put<T = unknown>(path: string, body?: unknown) {
        return request<T>(path, {
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
        })
    },

    del<T = unknown>(path: string) {
        return request<T>(path, { method: "DELETE" })
    },

    upload<T = unknown>(path: string, formData: FormData) {
        return fetch(`/api/backend${path}`, {
            method: "POST",
            credentials: "include",
            body: formData,
        })
    },
}
