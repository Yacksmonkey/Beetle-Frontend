import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function proxy(request: NextRequest, { path }: { path: string[] }) {
    const pathname = path.join("/")
    const search = request.nextUrl.search
    const backendUrl = `${BACKEND_URL}/${pathname}${search}`

    const token = request.cookies.get("auth_token")
    const headers = new Headers()
    if (token) {
        headers.set("Cookie", `auth_token=${token.value}`)
    }

    const contentType = request.headers.get("content-type")
    if (contentType) {
        headers.set("Content-Type", contentType)
    }

    const isGetOrHead = request.method === "GET" || request.method === "HEAD"
    const body = isGetOrHead ? undefined : await request.arrayBuffer()

    try {
        const backendRes = await fetch(backendUrl, {
            method: request.method,
            headers,
            body: body,
        })

        const responseBody = await backendRes.arrayBuffer()
        const responseHeaders = new Headers()
        const resContentType = backendRes.headers.get("content-type")
        if (resContentType) {
            responseHeaders.set("Content-Type", resContentType)
        }

        return new NextResponse(responseBody, {
            status: backendRes.status,
            statusText: backendRes.statusText,
            headers: responseHeaders,
        })
    } catch {
        return NextResponse.json(
            { message: "Backend proxy error" },
            { status: 502 }
        )
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return proxy(request, await params)
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return proxy(request, await params)
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return proxy(request, await params)
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    return proxy(request, await params)
}
