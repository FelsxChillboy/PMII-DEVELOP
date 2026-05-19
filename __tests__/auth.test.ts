import { describe, it, expect } from "vitest"

const jwtCallback = async (params: {
  token: Record<string, unknown>
  user?: Record<string, unknown>
  account?: Record<string, unknown>
}) => {
  const { token, user, account } = params
  if (account && user) {
    return {
      ...token,
      sub: user.id,
      id: user.id,
      role: (user.role as string) || "USER",
    }
  }
  return token
}

const sessionCallback = async (params: {
  session: { user: Record<string, unknown> }
  token: Record<string, unknown>
}) => {
  const { session, token } = params
  if (session.user) {
    session.user.id = ((token.sub || token.id) as string) ?? ""
    session.user.role = ((token.role as string) ?? "USER") as string
  }
  return session
}

describe("JWT Callback", () => {
  it("injects sub, id, role on sign-in", async () => {
    const token = await jwtCallback({
      token: {},
      user: { id: "u1", name: "Test", role: "ADMIN" },
      account: { provider: "credentials" },
    })
    expect(token.sub).toBe("u1")
    expect(token.id).toBe("u1")
    expect(token.role).toBe("ADMIN")
  })

  it("preserves existing token on refresh (no account/user)", async () => {
    const token = await jwtCallback({
      token: { sub: "u1", id: "u1", role: "USER" },
    })
    expect(token.sub).toBe("u1")
    expect(token.role).toBe("USER")
  })

  it("defaults role to USER when not provided", async () => {
    const token = await jwtCallback({
      token: {},
      user: { id: "u2" },
      account: { provider: "github" },
    })
    expect(token.sub).toBe("u2")
    expect(token.role).toBe("USER")
  })
})

describe("Session Callback", () => {
  it("maps token.sub to session.user.id", async () => {
    const session = await sessionCallback({
      session: { user: { name: "Test" } },
      token: { sub: "u1", id: "u1", role: "ADMIN" },
    })
    expect(session.user.id).toBe("u1")
    expect(session.user.role).toBe("ADMIN")
  })

  it("falls back to token.id when sub is missing", async () => {
    const session = await sessionCallback({
      session: { user: {} },
      token: { id: "u2", role: "USER" },
    })
    expect(session.user.id).toBe("u2")
    expect(session.user.role).toBe("USER")
  })

  it("defaults role to USER when role not set", async () => {
    const session = await sessionCallback({
      session: { user: {} },
      token: { sub: "u3" },
    })
    expect(session.user.id).toBe("u3")
    expect(session.user.role).toBe("USER")
  })
})
