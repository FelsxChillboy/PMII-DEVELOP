import { rateLimitRedis } from "@/lib/redis"

const store = new Map<string, { count: number; reset: number }>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

export async function checkRateLimit(key: string, maxRequests = MAX_REQUESTS, windowMs = WINDOW_MS) {
  const redisResult = await rateLimitRedis(key, maxRequests, windowMs)
  if (redisResult) return redisResult

  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.reset) {
    store.set(key, { count: 1, reset: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, retryAfter: 0 }
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.reset - now) / 1000)
    return { allowed: false, remaining: 0, retryAfter }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count, retryAfter: 0 }
}

export async function rateLimitMiddleware(key: string, maxRequests = MAX_REQUESTS, windowMs = WINDOW_MS) {
  const result = await checkRateLimit(key, maxRequests, windowMs)
  if (!result.allowed) {
    return new Response(
      JSON.stringify({ success: false, error: `Terlalu banyak permintaan. Coba lagi dalam ${result.retryAfter} detik.` }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(result.retryAfter),
        },
      }
    )
  }
  return null
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "127.0.0.1"
}
