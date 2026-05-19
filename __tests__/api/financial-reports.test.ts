import { describe, it, expect } from "vitest"
import { FinancialReportQuerySchema, DonationSchema } from "@/lib/schemas"

describe("FinancialReportQuerySchema", () => {
  it("rejects invalid date string", () => {
    const result = FinancialReportQuerySchema.safeParse({
      startDate: "not-a-date",
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid endDate as well", () => {
    const result = FinancialReportQuerySchema.safeParse({
      endDate: "invalid",
    })
    expect(result.success).toBe(false)
  })

  it("accepts valid ISO date (YYYY-MM-DD)", () => {
    const result = FinancialReportQuerySchema.safeParse({
      startDate: "2024-01-01",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.startDate).toBe("2024-01-01")
    }
  })

  it("accepts valid ISO datetime", () => {
    const result = FinancialReportQuerySchema.safeParse({
      startDate: "2024-01-01T00:00:00.000Z",
      endDate: "2024-12-31T23:59:59.000Z",
    })
    expect(result.success).toBe(true)
  })

  it("accepts empty query (all optional)", () => {
    const result = FinancialReportQuerySchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.startDate).toBeUndefined()
      expect(result.data.endDate).toBeUndefined()
    }
  })

  it("rejects startDate=invalid with descriptive error message", () => {
    const result = FinancialReportQuerySchema.safeParse({
      startDate: "invalid",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("tanggal")
    }
  })

  it("accepts type and category filters", () => {
    const result = FinancialReportQuerySchema.safeParse({
      type: "INCOME",
      category: "Donasi",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.type).toBe("INCOME")
      expect(result.data.category).toBe("Donasi")
    }
  })
})

describe("DonationSchema.amount", () => {
  it("allows amounts up to 100 million", () => {
    const result = DonationSchema.safeParse({
      amount: 100_000_000,
      type: "ONE_TIME",
    })
    expect(result.success).toBe(true)
  })

  it("rejects amounts over 100 million", () => {
    const result = DonationSchema.safeParse({
      amount: 100_000_001,
      type: "ONE_TIME",
    })
    expect(result.success).toBe(false)
  })

  it("rejects amounts below minimum (1000)", () => {
    const result = DonationSchema.safeParse({
      amount: 500,
      type: "ONE_TIME",
    })
    expect(result.success).toBe(false)
  })

  it("allows valid amount in range", () => {
    const result = DonationSchema.safeParse({
      amount: 50000,
      type: "ONE_TIME",
    })
    expect(result.success).toBe(true)
  })
})
