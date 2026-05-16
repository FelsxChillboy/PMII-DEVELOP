import { NextResponse } from "next/server"

export function success<T>(data: T, status = 200, headers?: Record<string, string>) {
  return NextResponse.json({ success: true, data }, { status, headers })
}

export function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function unauthorized(message = "Unauthorized") {
  return error(message, 401)
}

export function notFound(message = "Not found") {
  return error(message, 404)
}

export function serverError(message = "Internal server error") {
  return error(message, 500)
}

export function parseSearchParams(request: Request) {
  const url = new URL(request.url)
  return {
    searchParams: url.searchParams,
    take: Math.min(Math.abs(Number(url.searchParams.get("take")) || 50), 100),
    skip: Math.abs(Number(url.searchParams.get("skip")) || 0),
  }
}
