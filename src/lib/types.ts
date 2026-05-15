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
  status: "draft" | "terbuka" | "penuh" | "berlangsung" | "selesai" | "dibatalkan"
  date_start: string
  date_end: string
  location: string
  time: string
  capacity_max: number
  capacity_registered: number
  image: string
}

export interface FinancialReport {
  id: string
  title: string
  type: "pemasukan" | "pengeluaran"
  amount: number
  category: string
  description: string
  date: string
}

export interface NavLink {
  label: string
  path: string
}
