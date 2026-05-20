const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || ""
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || ""
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true"

const BASE_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1"
  : "https://app.sandbox.midtrans.com/snap/v1"

const API_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? "https://api.midtrans.com/v2"
  : "https://api.sandbox.midtrans.com/v2"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

function getAuthHeader() {
  const encoded = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")
  return `Basic ${encoded}`
}

export interface CreateTransactionParams {
  orderId: string
  amount: number
  donorName?: string
  donorEmail?: string
  donorPhone?: string
}

export interface TransactionResult {
  transactionId: string
  paymentUrl: string
  status: "PENDING" | "SUCCESS" | "FAILED"
}

export async function createSnapTransaction(params: CreateTransactionParams): Promise<TransactionResult> {
  if (!MIDTRANS_SERVER_KEY) {
    return {
      transactionId: params.orderId,
      paymentUrl: `${APP_URL}/donasi?order_id=${params.orderId}`,
      status: "PENDING",
    }
  }

  const body = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    credit_card: { secure: true },
    customer_details: {
      first_name: params.donorName || "Donatur",
      email: params.donorEmail || "",
      phone: params.donorPhone || "",
    },
    callbacks: {
      finish: `${APP_URL}/donasi?status=finish&order_id=${params.orderId}`,
      error: `${APP_URL}/donasi?status=error&order_id=${params.orderId}`,
      pending: `${APP_URL}/donasi?status=pending&order_id=${params.orderId}`,
    },
    enabled_payments: [
      "credit_card",
      "gopay",
      "shopeepay",
      "qris",
      "bank_transfer",
      "cstore",
    ],
  }

  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.text()
    console.error("Midtrans create transaction failed:", errBody)
    throw new Error("Gagal membuat transaksi pembayaran")
  }

  const data = await res.json()
  return {
    transactionId: data.transaction_id,
    paymentUrl: data.redirect_url,
    status: "PENDING",
  }
}

export async function getTransactionStatus(orderId: string): Promise<TransactionResult> {
  if (!MIDTRANS_SERVER_KEY) {
    return { transactionId: orderId, paymentUrl: "", status: "PENDING" }
  }

  const res = await fetch(`${API_BASE_URL}/${orderId}/status`, {
    headers: { Authorization: getAuthHeader() },
  })

  if (!res.ok) {
    console.error("Midtrans status check failed:", await res.text())
    return { transactionId: orderId, paymentUrl: "", status: "FAILED" }
  }

  const data = await res.json()

  const statusMap: Record<string, "PENDING" | "SUCCESS" | "FAILED"> = {
    capture: "SUCCESS",
    settlement: "SUCCESS",
    pending: "PENDING",
    deny: "FAILED",
    cancel: "FAILED",
    expire: "FAILED",
    failure: "FAILED",
  }

  return {
    transactionId: data.transaction_id,
    paymentUrl: "",
    status: statusMap[data.transaction_status] || "PENDING",
  }
}

export function verifyWebhookNotification(payload: Record<string, unknown>): boolean {
  if (!MIDTRANS_SERVER_KEY) return true

  const orderId = payload.order_id as string
  const statusCode = payload.status_code as string
  const grossAmount = payload.gross_amount as string
  const serverKey = MIDTRANS_SERVER_KEY

  const hash = require("crypto")
    .createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex")

  return hash === (payload.signature_key as string)
}

export function getClientKey(): string {
  return MIDTRANS_CLIENT_KEY
}

export function isPaymentEnabled(): boolean {
  return !!MIDTRANS_SERVER_KEY
}
