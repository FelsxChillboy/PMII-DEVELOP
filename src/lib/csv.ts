export function toCsv(headers: string[], rows: Record<string, unknown>[]): string {
  const escape = (val: unknown): string => {
    const s = String(val ?? "")
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }

  const headerLine = headers.map(escape).join(",")
  const dataLines = rows.map((row) =>
    headers.map((h) => escape(row[h])).join(",")
  )

  return [headerLine, ...dataLines].join("\r\n")
}

export function csvResponse(data: string, filename: string): Response {
  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
