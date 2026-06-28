import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const token = request.cookies.get("auth_token")

    if (!token) {
        return NextResponse.json(
            { message: "Not authenticated" },
            { status: 401 }
        )
    }

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
            {
                method: "GET",
                headers: {
                    Cookie: `auth_token=${token.value}`,
                },
            }
        )

        if (!res.ok) {
            const text = await res.text().catch(() => "")
            return NextResponse.json(
                { message: text || "Not authenticated" },
                { status: res.status }
            )
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )
    }
}
