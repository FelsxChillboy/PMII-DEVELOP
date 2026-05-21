import Redis from "ioredis"

const REDIS_URL = process.env.REDIS_URL || ""

let redisInstance: Redis | null = null
let publisher: Redis | null = null
let subscriber: Redis | null = null

let redisAvailable = false

export function initRedis() {
  if (redisInstance) return
  if (!REDIS_URL) {
    console.warn("⚠️ REDIS_URL not set, Redis features disabled (rate-limit falls back to in-memory)")
    return
  }
  try {
    redisInstance = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null
        return Math.min(times * 200, 2000)
      },
      lazyConnect: true,
    })
    publisher = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null
        return Math.min(times * 200, 2000)
      },
      lazyConnect: true,
    })
    subscriber = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null
        return Math.min(times * 200, 2000)
      },
      lazyConnect: true,
    })
  } catch (err) {
    console.warn("⚠️ Redis connection failed, features disabled:", err)
    redisInstance = null
    publisher = null
    subscriber = null
    return
  }
}

async function connectInstance(inst: Redis, label: string) {
  if (!inst) return false
  try {
    await inst.connect()
    return true
  } catch (err) {
    console.warn(`⚠️ Redis ${label} connection failed:`, err)
    return false
  }
}

export async function ensureRedis() {
  if (redisAvailable) return true
  initRedis()
  if (!redisInstance) return false

  const ok = await connectInstance(redisInstance, "instance")
  const pubOk = publisher ? await connectInstance(publisher, "publisher") : false
  const subOk = subscriber ? await connectInstance(subscriber, "subscriber") : false

  redisAvailable = ok && (pubOk || !publisher) && (subOk || !subscriber)
  return redisAvailable
}

export function getRedis() {
  return redisAvailable ? redisInstance : null
}

export function getPublisher() {
  return redisAvailable ? publisher : null
}

export function getSubscriber() {
  return redisAvailable ? subscriber : null
}

export async function rateLimitRedis(key: string, maxRequests: number, windowMs: number) {
  if (!redisAvailable && !await ensureRedis()) {
    return null
  }

  const redis = getRedis()
  if (!redis) return null

  const now = Date.now()
  const windowKey = `ratelimit:${key}`
  const cleanupMs = Math.max(windowMs, 1000)

  const count = await redis.incr(windowKey)
  if (count === 1) {
    await redis.pexpire(windowKey, cleanupMs)
  }

  if (count > maxRequests) {
    const ttl = await redis.pttl(windowKey)
    const retryAfter = Math.max(1, Math.ceil(ttl / 1000))
    return { allowed: false, remaining: 0, retryAfter }
  }

  return { allowed: true, remaining: maxRequests - count, retryAfter: 0 }
}

export async function publish(channel: string, message: string) {
  const pub = getPublisher()
  if (!pub) return
  try {
    await pub.publish(channel, message)
  } catch (err) {
    console.error(`Redis publish to ${channel} failed:`, err)
  }
}

export async function subscribe(channel: string, handler: (message: string) => void) {
  const sub = getSubscriber()
  if (!sub) return false
  try {
    await sub.subscribe(channel)
    sub.on("message", (ch, msg) => {
      if (ch === channel) handler(msg)
    })
    return true
  } catch (err) {
    console.error(`Redis subscribe to ${channel} failed:`, err)
    return false
  }
}
