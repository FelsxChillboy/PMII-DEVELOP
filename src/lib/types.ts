export interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image: string
  author: string
  published: boolean
  created_date: string
}

export interface Event {
  id: string
  title: string
  description: string
  type: string
  status: "DRAFT" | "TERBUKA" | "PENUH" | "BERLANGSUNG" | "SELESAI" | "DIBATALKAN"
  date: string
  dateEnd?: string
  location: string
  time?: string
  capacity: number
  image?: string
  _count?: { registrations: number }
}

export interface FinancialReport {
  id: string
  title: string
  type: "INCOME" | "EXPENSE"
  amount: number
  category: string
  description?: string
  date: string
}

export interface NavLink {
  label: string
  path: string
}

export type ActionResult = { success: true } | { error: string }
