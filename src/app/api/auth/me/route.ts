import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const token = request.cookies.get('auth_token')

    if (!token) {
        return NextResponse.json(
            { authenticated: false },
            { status: 401 }
        )
    }

    return NextResponse.json({
        authenticated: true,
    })
}
