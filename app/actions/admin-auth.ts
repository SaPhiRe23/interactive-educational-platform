"use server"

import { redirect } from "next/navigation"
import { createAdminSession, destroyAdminSession, verifyPassword } from "@/lib/admin-auth"

export async function loginAdmin(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "")

  if (!password) {
    return { ok: false, message: "Ingresa la contraseña." }
  }

  if (!verifyPassword(password)) {
    return { ok: false, message: "Contraseña incorrecta." }
  }

  await createAdminSession()
  redirect("/admin")
}

export async function logoutAdmin() {
  await destroyAdminSession()
  redirect("/login")
}
