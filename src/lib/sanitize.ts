import sanitizeHtml from "sanitize-html"

const ALLOWED_TAGS = [
  "p", "br", "b", "i", "u", "em", "strong", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
  "img", "figure", "figcaption", "hr", "table", "thead", "tbody", "tr", "th", "td",
  "div", "span", "sub", "sup", "strike",
]

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "target", "rel", "title"],
  img: ["src", "alt", "width", "height", "loading"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan"],
  "*": ["class", "id", "style"],
}

export function sanitizeContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  })
}
