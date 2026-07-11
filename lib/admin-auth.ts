import { cookies } from "next/headers"
import { createHash } from "crypto"

const COOKIE_NAME = "patinodromo_admin"

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD ?? "patinodromo2026"
  return createHash("sha256").update(`patinodromo::${password}`).digest("hex")
}

export function verifyPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "patinodromo2026"
  return password === expected
}

export async function createAdminSession() {
  const store = await cookies()
  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
}

export async function destroyAdminSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAdmin() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return token === expectedToken()
}
