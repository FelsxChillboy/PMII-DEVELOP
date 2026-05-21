import { describe, it, expect } from "vitest"
import { sanitizeContent } from "@/lib/sanitize"

describe("sanitizeContent", () => {
  it("allows safe HTML tags", () => {
    const result = sanitizeContent("<p>Hello <strong>World</strong></p>")
    expect(result).toContain("<p>")
    expect(result).toContain("<strong>")
  })

  it("strips script tags", () => {
    const result = sanitizeContent("<script>alert('xss')</script><p>safe</p>")
    expect(result).not.toContain("<script>")
    expect(result).toContain("<p>safe</p>")
  })

  it("strips event handlers", () => {
    const result = sanitizeContent('<img src=x onerror="alert(1)">')
    expect(result).not.toContain("onerror")
  })

  it("adds target=_blank to links", () => {
    const result = sanitizeContent('<a href="https://example.com">link</a>')
    expect(result).toContain('target="_blank"')
    expect(result).toContain('rel="noopener noreferrer"')
  })

  it("allows basic formatting", () => {
    const result = sanitizeContent("<h1>Title</h1><p>Body <em>text</em></p><ul><li>Item</li></ul>")
    expect(result).toContain("<h1>")
    expect(result).toContain("<em>")
    expect(result).toContain("<ul>")
  })
})
