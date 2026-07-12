"use server"

import { db } from "@/lib/db"
import { participants, surveyAnswers, surveyQuestions, surveyResponses } from "@/lib/db/schema"
import { getSettings } from "@/lib/data"
import { eq } from "drizzle-orm"
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

  if (fullName.length < 3) return { ok: false, message: "Ingresa tu nombre completo." }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, message: "Ingresa un correo válido." }

  let code = generateCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await db.insert(participants).values({
        fullName,
        email,
        phone: phone || null,
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
  const questions = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.active, true))

  if (questions.length === 0) {
    return { ok: false, message: "La encuesta no está disponible en este momento." }
  }

  const collected: { questionId: number; value: string }[] = []
  const starsValues: number[] = []

  for (const question of questions) {
    if (question.type === "multi_choice") {
      const values = formData.getAll(`q_${question.id}`).map((v) => String(v))
      if (question.required && values.length === 0) {
        return { ok: false, message: `Responde: "${question.label}"` }
      }
      if (values.length > 0) collected.push({ questionId: question.id, value: values.join(" | ") })
      continue
    }

    const raw = String(formData.get(`q_${question.id}`) ?? "").trim()

    if (question.required && !raw) {
      return { ok: false, message: `Responde: "${question.label}"` }
    }
    if (!raw) continue

    if (question.type === "stars") {
      const n = Number(raw)
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        return { ok: false, message: `Selecciona una calificación válida para: "${question.label}"` }
      }
      starsValues.push(n)
    }

    collected.push({ questionId: question.id, value: raw })
  }

  // Keep the legacy overall-rating column populated (it's NOT NULL) using the
  // average of any star-rating answers, so older admin dashboards keep working.
  const overallRating =
    starsValues.length > 0 ? Math.round(starsValues.reduce((a, b) => a + b, 0) / starsValues.length) : 3

  const [response] = await db
    .insert(surveyResponses)
    .values({ overallRating })
    .returning({ id: surveyResponses.id })

  if (collected.length > 0) {
    await db.insert(surveyAnswers).values(
      collected.map((a) => ({
        responseId: response.id,
        questionId: a.questionId,
        value: a.value,
      })),
    )
  }

  revalidatePath("/estadisticas")
  revalidatePath("/admin")
  revalidatePath("/admin/encuestas")
  return { ok: true, message: "¡Gracias por tu opinión!" }
}
