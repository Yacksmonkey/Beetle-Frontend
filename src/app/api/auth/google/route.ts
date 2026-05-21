import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { googleToken } = body

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ googleToken }),
            }
        )

        if (!res.ok) {
            return NextResponse.json(
                { message: 'Google authentication failed' },
                { status: 401 }
            )
        }

        const data = await res.json()

        const response = NextResponse.json({
            userId: data.userId,
            email: data.email,
            roles: data.roles,
        })

        response.cookies.set('auth_token', data.token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24h
        })

        return response
    } catch {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        )
    }
}
