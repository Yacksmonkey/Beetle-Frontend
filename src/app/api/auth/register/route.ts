import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            }
        )

        const contentType = res.headers.get("content-type") ?? ""
        const data = contentType.includes("application/json")
            ? await res.json().catch(() => null)
            : await res.text().catch(() => "")

        if (!res.ok) {
            const message =
                typeof data === "string"
                    ? data
                    : data?.message || "Registration failed."

            return NextResponse.json(
                { message },
                { status: res.status }
            )
        }

        if (data && typeof data === "object" && data.token) {
            const response = NextResponse.json({
                userId: data.userId,
                email: data.email,
                name: data.name,
                roles: data.roles,
            })

            response.cookies.set("auth_token", data.token, {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24,
            })

            return response
        }

        return NextResponse.json(
            { message: "Your account has been created successfully. Please log in." }
        )
    } catch {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )
    }
}