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

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")

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
  description: z.string().max(2000).optional(),
  date: isoDate,
})

export const NewsSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200),
  slug: z.string().min(1, "Slug wajib diisi").max(200).regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  content: z.string().min(1, "Konten wajib diisi"),
  imageUrl: z.string().max(500).optional(),
  published: z.boolean().default(false),
})

export const EventSchema = z.object({
  title: z.string().min(1, "Nama kegiatan wajib diisi").max(200),
  slug: z.string().min(1, "Slug wajib diisi").max(200).regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi").max(200),
  date: z.string().min(1, "Tanggal wajib diisi"),
  capacity: z.number().int().min(1, "Kapasitas minimal 1"),
  type: z.string().max(100).optional(),
  time: z.string().max(50).optional(),
  image: z.string().max(500).optional(),
  dateEnd: z.string().optional(),
})

export const AdminFinancialReportSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200),
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().int().min(1, "Jumlah harus lebih dari 0"),
  category: z.string().min(1, "Kategori wajib diisi").max(100),
  description: z.string().max(2000).optional(),
  date: z.string().min(1, "Tanggal wajib diisi"),
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
