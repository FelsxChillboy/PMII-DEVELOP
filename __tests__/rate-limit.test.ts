import { describe, it, expect } from "vitest"
import { checkRateLimit } from "@/lib/rate-limit"

describe("checkRateLimit", () => {
  it("allows first request", async () => {
    const result = await checkRateLimit("test-key", 5, 60_000)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it("blocks after exceeding limit", async () => {
    const key = `block-key-${Date.now()}-${Math.random()}`
    for (let i = 0; i < 4; i++) {
      const result = await checkRateLimit(key, 3, 60_000)
      if (i < 3) expect(result.allowed).toBe(true)
      else {
        expect(result.allowed).toBe(false)
        expect(result.remaining).toBe(0)
        expect(result.retryAfter).toBeGreaterThan(0)
      }
    }
  })

  it("uses different windows for different keys", async () => {
    const result1 = await checkRateLimit("key-a", 2, 60_000)
    const result2 = await checkRateLimit("key-b", 2, 60_000)
    expect(result1.allowed).toBe(true)
    expect(result2.allowed).toBe(true)
  })
})
