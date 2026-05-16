import { z } from "zod"

export const DonationSchema = z.object({
  amount: z.number().int().min(1000, "Minimum donasi Rp 1.000"),
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

export const FinancialReportQuerySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})
