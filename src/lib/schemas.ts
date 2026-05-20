import { z } from "zod"

export const DonationSchema = z.object({
  amount: z.number().int().min(1000, "Minimum donasi Rp 1.000").max(100_000_000, "Maksimum donasi Rp 100.000.000"),
  message: z.string().max(500).optional(),
  type: z.enum(["ONE_TIME", "RECURRING"]).default("ONE_TIME"),
  donorName: z.string().max(100).optional(),
  donorEmail: z.string().email().max(100).optional(),
  donorPhone: z.string().max(20).optional(),
})

export const ContactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  email: z.string().email("Email tidak valid").max(100),
  subject: z.string().min(1, "Subjek wajib diisi").max(200),
  message: z.string().min(1, "Pesan wajib diisi").max(2000),
})

const isoDate = z.string().refine((v) => !isNaN(Date.parse(v)), "Format tanggal tidak valid (YYYY-MM-DD)")

export const FinancialReportQuerySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().max(100).optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
})

export const FinancialReportSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200),
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().int().min(1, "Jumlah harus lebih dari 0"),
  category: z.string().min(1, "Kategori wajib diisi").max(100),
  date: isoDate,
})

export const RegistrationSchema = z.object({
  eventId: z.string().min(1, "Event ID wajib diisi"),
})

export const UpdateRegistrationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
})

export const UpdateUserRoleSchema = z.object({
  role: z.enum(["USER", "MEMBER", "ADMIN"]),
})
