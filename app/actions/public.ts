"use server"

import { db } from "@/lib/db"
import { participants, surveyResponses } from "@/lib/db/schema"
import { getSettings } from "@/lib/data"
import { revalidatePath } from "next/cache"

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let out = ""
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return `PAT-${out}`
}

export async function registerParticipant(_prev: unknown, formData: FormData) {
  const settings = await getSettings()
  if (!settings.registrationOpen) {
    return { ok: false, message: "Las inscripciones están cerradas por el momento." }
  }

  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const category = String(formData.get("category") ?? "espectador").trim()
  const city = String(formData.get("city") ?? "").trim()

  if (fullName.length < 3) return { ok: false, message: "Ingresa tu nombre completo." }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, message: "Ingresa un correo válido." }
  if (!["competidor", "recreativo", "espectador"].includes(category)) {
    return { ok: false, message: "Selecciona una categoría válida." }
  }

  let code = generateCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await db.insert(participants).values({
        fullName,
        email,
        phone: phone || null,
        category,
        city: city || null,
        code,
      })
      revalidatePath("/estadisticas")
      revalidatePath("/admin")
      return { ok: true, message: "¡Inscripción exitosa!", code }
    } catch (err) {
      // likely a unique code collision — retry with a new code
      code = generateCode()
    }
  }
  return { ok: false, message: "No se pudo completar la inscripción. Intenta de nuevo." }
}

export async function submitSurvey(_prev: unknown, formData: FormData) {
  const overall = Number(formData.get("overallRating") ?? 0)
  const organization = Number(formData.get("organizationRating") ?? 0)
  const venue = Number(formData.get("venueRating") ?? 0)
  const wouldRecommend = formData.get("wouldRecommend") === "yes"
  const favoriteActivity = String(formData.get("favoriteActivity") ?? "").trim()
  const comment = String(formData.get("comment") ?? "").trim()

  if (overall < 1 || overall > 5) {
    return { ok: false, message: "Selecciona una calificación general del 1 al 5." }
  }

  await db.insert(surveyResponses).values({
    overallRating: overall,
    organizationRating: organization || null,
    venueRating: venue || null,
    wouldRecommend,
    favoriteActivity: favoriteActivity || null,
    comment: comment || null,
  })

  revalidatePath("/estadisticas")
  revalidatePath("/admin")
  return { ok: true, message: "¡Gracias por tu opinión!" }
}
