import { describe, it, expect } from "vitest"
import { NewsSchema, EventSchema, AdminFinancialReportSchema, DonationSchema } from "@/lib/schemas"

describe("NewsSchema", () => {
  it("accepts valid news data", () => {
    const result = NewsSchema.safeParse({
      title: "Berita Baru",
      slug: "berita-baru",
      content: "<p>Konten berita</p>",
      published: true,
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid slug", () => {
    const result = NewsSchema.safeParse({
      title: "Berita",
      slug: "Berita Dengan Spasi",
      content: "test",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty title", () => {
    const result = NewsSchema.safeParse({
      title: "",
      slug: "berita",
      content: "test",
    })
    expect(result.success).toBe(false)
  })

  it("accepts optional imageUrl", () => {
    const result = NewsSchema.safeParse({
      title: "Test",
      slug: "test",
      content: "test content",
      imageUrl: "https://example.com/image.jpg",
      published: false,
    })
    expect(result.success).toBe(true)
  })
})

describe("EventSchema", () => {
  it("accepts valid event data", () => {
    const result = EventSchema.safeParse({
      title: "Seminar",
      slug: "seminar-2024",
      description: "Deskripsi seminar",
      location: "Aula",
      date: "2024-12-01T09:00",
      capacity: 100,
    })
    expect(result.success).toBe(true)
  })

  it("rejects negative capacity", () => {
    const result = EventSchema.safeParse({
      title: "Event",
      slug: "event",
      description: "desc",
      location: "Lokasi",
      date: "2024-12-01",
      capacity: 0,
    })
    expect(result.success).toBe(false)
  })
})

describe("DonationSchema", () => {
  it("accepts valid donation", () => {
    const result = DonationSchema.safeParse({
      amount: 50000,
      donorName: "Test",
      donorEmail: "test@example.com",
    })
    expect(result.success).toBe(true)
  })

  it("rejects too small amount", () => {
    const result = DonationSchema.safeParse({ amount: 500 })
    expect(result.success).toBe(false)
  })
})

describe("AdminFinancialReportSchema", () => {
  it("accepts valid report", () => {
    const result = AdminFinancialReportSchema.safeParse({
      title: "Laporan Kegiatan",
      type: "INCOME",
      amount: 100000,
      category: "Kegiatan",
      date: "2024-12-01",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid type", () => {
    const result = AdminFinancialReportSchema.safeParse({
      title: "Test",
      type: "INVALID",
      amount: 1000,
      category: "Test",
      date: "2024-12-01",
    })
    expect(result.success).toBe(false)
  })
})
