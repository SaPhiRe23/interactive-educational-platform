"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  activities,
  badges,
  eventSettings,
  mapZones,
  mediaItems,
  participantBadges,
  participants,
  surveyAnswers,
  surveyQuestions,
  surveyResponses,
} from "@/lib/db/schema"
import { isAdmin } from "@/lib/admin-auth"
import { STAT_METRICS } from "@/lib/data"
import { DEFAULT_SURVEY_QUESTIONS, QUESTION_TYPES } from "@/lib/survey-options"

type ActionResult = { ok: boolean; message?: string }

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("No autorizado")
  }
}

function revalidateAll() {
  revalidatePath("/admin")
  revalidatePath("/cronograma")
  revalidatePath("/mapa")
  revalidatePath("/galeria")
  revalidatePath("/insignias")
  revalidatePath("/estadisticas")
}

// ---------- Event settings ----------

export async function updateSettings(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const eventName = String(formData.get("eventName") ?? "").trim()
  const eventTagline = String(formData.get("eventTagline") ?? "").trim()
  const eventDates = String(formData.get("eventDates") ?? "").trim()
  const eventLocation = String(formData.get("eventLocation") ?? "").trim()
  const registrationOpen = formData.get("registrationOpen") === "on"

  if (!eventName) return { ok: false, message: "El nombre del evento es obligatorio." }

  const entries: [string, string][] = [
    ["event_name", eventName],
    ["event_tagline", eventTagline],
    ["event_dates", eventDates],
    ["event_location", eventLocation],
    ["registration_open", registrationOpen ? "true" : "false"],
  ]

  for (const [key, value] of entries) {
    await db
      .insert(eventSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: eventSettings.key, set: { value } })
  }

  revalidateAll()
  revalidatePath("/")
  revalidatePath("/inscripcion")
  return { ok: true, message: "Configuración guardada." }
}

// ---------- Stat display settings (visibility + manual overrides) ----------

export async function updateStatSettings(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const entries: [string, string][] = []

  for (const { key } of STAT_METRICS) {
    const visible = formData.get(`visible_${key}`) === "on"
    const overrideRaw = String(formData.get(`override_${key}`) ?? "").trim()

    if (overrideRaw && Number.isNaN(Number(overrideRaw))) {
      return { ok: false, message: `El valor manual para "${key}" debe ser un número.` }
    }

    entries.push([`stat_visible_${key}`, visible ? "true" : "false"])
    entries.push([`stat_override_${key}`, overrideRaw])
  }

  for (const [key, value] of entries) {
    await db
      .insert(eventSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: eventSettings.key, set: { value } })
  }

  revalidateAll()
  revalidatePath("/")
  revalidatePath("/estadisticas")
  return { ok: true, message: "Estadísticas actualizadas." }
}

// ---------- Activities (cronograma) ----------

export async function createActivity(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const location = String(formData.get("location") ?? "").trim()
  const dayLabel = String(formData.get("dayLabel") ?? "").trim()
  const startsAt = String(formData.get("startsAt") ?? "")
  const endsAt = String(formData.get("endsAt") ?? "")
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (title.length < 2) return { ok: false, message: "Ingresa un título para la actividad." }
  if (!startsAt) return { ok: false, message: "Ingresa la fecha y hora de inicio." }

  await db.insert(activities).values({
    title,
    description: description || null,
    location: location || null,
    dayLabel: dayLabel || null,
    startsAt: new Date(startsAt),
    endsAt: endsAt ? new Date(endsAt) : null,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  })

  revalidateAll()
  return { ok: true, message: "Actividad creada." }
}

export async function updateActivity(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const id = Number(formData.get("id"))
  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const location = String(formData.get("location") ?? "").trim()
  const dayLabel = String(formData.get("dayLabel") ?? "").trim()
  const startsAt = String(formData.get("startsAt") ?? "")
  const endsAt = String(formData.get("endsAt") ?? "")
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (!id) return { ok: false, message: "Actividad inválida." }
  if (title.length < 2) return { ok: false, message: "Ingresa un título para la actividad." }
  if (!startsAt) return { ok: false, message: "Ingresa la fecha y hora de inicio." }

  await db
    .update(activities)
    .set({
      title,
      description: description || null,
      location: location || null,
      dayLabel: dayLabel || null,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .where(eq(activities.id, id))

  revalidateAll()
  return { ok: true, message: "Actividad actualizada." }
}

export async function deleteActivity(id: number): Promise<ActionResult> {
  await requireAdmin()
  await db.delete(activities).where(eq(activities.id, id))
  revalidateAll()
  return { ok: true }
}

// ---------- Map zones ----------

export async function createMapZone(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const icon = String(formData.get("icon") ?? "map-pin").trim() || "map-pin"
  const color = String(formData.get("color") ?? "primary").trim() || "primary"
  const posX = Number(formData.get("posX") ?? 50)
  const posY = Number(formData.get("posY") ?? 50)
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (name.length < 2) return { ok: false, message: "Ingresa un nombre para la zona." }

  await db.insert(mapZones).values({
    name,
    description: description || null,
    icon,
    color,
    posX: Number.isFinite(posX) ? posX : 50,
    posY: Number.isFinite(posY) ? posY : 50,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  })

  revalidateAll()
  return { ok: true, message: "Zona creada." }
}

export async function updateMapZone(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const id = Number(formData.get("id"))
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const icon = String(formData.get("icon") ?? "map-pin").trim() || "map-pin"
  const color = String(formData.get("color") ?? "primary").trim() || "primary"
  const posX = Number(formData.get("posX") ?? 50)
  const posY = Number(formData.get("posY") ?? 50)
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (!id) return { ok: false, message: "Zona inválida." }
  if (name.length < 2) return { ok: false, message: "Ingresa un nombre para la zona." }

  await db
    .update(mapZones)
    .set({
      name,
      description: description || null,
      icon,
      color,
      posX: Number.isFinite(posX) ? posX : 50,
      posY: Number.isFinite(posY) ? posY : 50,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .where(eq(mapZones.id, id))

  revalidateAll()
  return { ok: true, message: "Zona actualizada." }
}

export async function deleteMapZone(id: number): Promise<ActionResult> {
  await requireAdmin()
  await db.delete(mapZones).where(eq(mapZones.id, id))
  revalidateAll()
  return { ok: true }
}

// ---------- Media (galería) ----------

export async function createMediaItem(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const type = String(formData.get("type") ?? "photo").trim() || "photo"
  const title = String(formData.get("title") ?? "").trim()
  const url = String(formData.get("url") ?? "").trim()
  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (!url) return { ok: false, message: "Ingresa la URL del archivo (foto o video)." }
  if (!["photo", "video"].includes(type)) return { ok: false, message: "Tipo inválido." }

  await db.insert(mediaItems).values({
    type,
    title: title || null,
    url,
    thumbnailUrl: thumbnailUrl || null,
    category: category || null,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  })

  revalidateAll()
  return { ok: true, message: "Elemento agregado a la galería." }
}

export async function deleteMediaItem(id: number): Promise<ActionResult> {
  await requireAdmin()
  await db.delete(mediaItems).where(eq(mediaItems.id, id))
  revalidateAll()
  return { ok: true }
}

// ---------- Badges (insignias) ----------

export async function createBadge(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const icon = String(formData.get("icon") ?? "award").trim() || "award"
  const color = String(formData.get("color") ?? "primary").trim() || "primary"
  const points = Number(formData.get("points") ?? 10)
  const sortOrder = Number(formData.get("sortOrder") ?? 0)

  if (name.length < 2) return { ok: false, message: "Ingresa un nombre para la insignia." }

  await db.insert(badges).values({
    name,
    description: description || null,
    icon,
    color,
    points: Number.isFinite(points) ? points : 10,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  })

  revalidateAll()
  return { ok: true, message: "Insignia creada." }
}

export async function deleteBadge(id: number): Promise<ActionResult> {
  await requireAdmin()
  await db.delete(participantBadges).where(eq(participantBadges.badgeId, id))
  await db.delete(badges).where(eq(badges.id, id))
  revalidateAll()
  return { ok: true }
}

export async function awardBadge(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase()
  const badgeId = Number(formData.get("badgeId"))

  if (!code) return { ok: false, message: "Ingresa el código del participante." }
  if (!badgeId) return { ok: false, message: "Selecciona una insignia." }

  const [participant] = await db.select().from(participants).where(eq(participants.code, code)).limit(1)
  if (!participant) return { ok: false, message: "No existe ningún participante con ese código." }

  const existing = await db
    .select()
    .from(participantBadges)
    .where(eq(participantBadges.participantId, participant.id))

  if (existing.some((row) => row.badgeId === badgeId)) {
    return { ok: false, message: "Este participante ya tiene esa insignia." }
  }

  await db.insert(participantBadges).values({ participantId: participant.id, badgeId })

  revalidateAll()
  return { ok: true, message: `Insignia otorgada a ${participant.fullName}.` }
}

export async function removeParticipantBadge(id: number): Promise<ActionResult> {
  await requireAdmin()
  await db.delete(participantBadges).where(eq(participantBadges.id, id))
  revalidateAll()
  return { ok: true }
}

// ---------- Participants ----------

export async function toggleParticipantCompleted(id: number, completed: boolean): Promise<ActionResult> {
  await requireAdmin()
  await db.update(participants).set({ completed }).where(eq(participants.id, id))
  revalidateAll()
  return { ok: true }
}

export async function updateParticipant(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const id = Number(formData.get("id"))
  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const phone = String(formData.get("phone") ?? "").trim()
  const category = String(formData.get("category") ?? "espectador").trim() || "espectador"
  const city = String(formData.get("city") ?? "").trim()
  const code = String(formData.get("code") ?? "").trim().toUpperCase()

  if (!id) return { ok: false, message: "Participante inválido." }
  if (fullName.length < 2) return { ok: false, message: "Ingresa el nombre completo." }
  if (!email.includes("@")) return { ok: false, message: "Ingresa un correo válido." }
  if (!code) return { ok: false, message: "El código no puede estar vacío." }
  if (!["competidor", "recreativo", "espectador"].includes(category)) {
    return { ok: false, message: "Categoría inválida." }
  }

  const codeOwner = await db.select().from(participants).where(eq(participants.code, code)).limit(1)
  if (codeOwner[0] && codeOwner[0].id !== id) {
    return { ok: false, message: "Ese código ya lo usa otro participante." }
  }

  await db
    .update(participants)
    .set({
      fullName,
      email,
      phone: phone || null,
      category,
      city: city || null,
      code,
    })
    .where(eq(participants.id, id))

  revalidateAll()
  return { ok: true, message: "Participante actualizado." }
}

export async function deleteParticipant(id: number): Promise<ActionResult> {
  await requireAdmin()
  await db.delete(participantBadges).where(eq(participantBadges.participantId, id))
  await db.delete(participants).where(eq(participants.id, id))
  revalidateAll()
  return { ok: true }
}

// ---------- Survey responses ----------

export async function deleteSurveyResponse(id: number): Promise<ActionResult> {
  await requireAdmin()
  await db.delete(surveyResponses).where(eq(surveyResponses.id, id))
  revalidateAll()
  return { ok: true }
}

// ---------- Survey questions (encuesta configurable) ----------

const QUESTION_TYPE_VALUES = QUESTION_TYPES.map((t) => t.value)

export async function createSurveyQuestion(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const label = String(formData.get("label") ?? "").trim()
  const type = String(formData.get("type") ?? "text").trim()
  const optionsRaw = String(formData.get("options") ?? "").trim()
  const helperMin = String(formData.get("helperMin") ?? "").trim()
  const helperMax = String(formData.get("helperMax") ?? "").trim()
  const required = formData.get("required") === "on"
  const sortOrder = Number(formData.get("sortOrder") ?? 0)
  const showInStats = formData.get("showInStats") === "on"
  const chartType = String(formData.get("chartType") ?? "bar").trim() || "bar"

  if (label.length < 3) return { ok: false, message: "Escribe el texto de la pregunta." }
  if (!QUESTION_TYPE_VALUES.includes(type as (typeof QUESTION_TYPE_VALUES)[number])) {
    return { ok: false, message: "Tipo de pregunta inválido." }
  }
  if ((type === "single_choice" || type === "multi_choice") && !optionsRaw) {
    return { ok: false, message: "Escribe al menos una opción (separadas por coma)." }
  }

  await db.insert(surveyQuestions).values({
    label,
    type,
    options: optionsRaw || null,
    helperMin: helperMin || null,
    helperMax: helperMax || null,
    required,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    active: true,
    showInStats,
    chartType,
  })

  revalidateAll()
  revalidatePath("/encuesta")
  return { ok: true, message: "Pregunta creada." }
}

export async function updateSurveyQuestion(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const id = Number(formData.get("id"))
  const label = String(formData.get("label") ?? "").trim()
  const type = String(formData.get("type") ?? "text").trim()
  const optionsRaw = String(formData.get("options") ?? "").trim()
  const helperMin = String(formData.get("helperMin") ?? "").trim()
  const helperMax = String(formData.get("helperMax") ?? "").trim()
  const required = formData.get("required") === "on"
  const sortOrder = Number(formData.get("sortOrder") ?? 0)
  const showInStats = formData.get("showInStats") === "on"
  const chartType = String(formData.get("chartType") ?? "bar").trim() || "bar"

  if (!id) return { ok: false, message: "Pregunta inválida." }
  if (label.length < 3) return { ok: false, message: "Escribe el texto de la pregunta." }
  if ((type === "single_choice" || type === "multi_choice") && !optionsRaw) {
    return { ok: false, message: "Escribe al menos una opción (separadas por coma)." }
  }

  await db
    .update(surveyQuestions)
    .set({
      label,
      type,
      options: optionsRaw || null,
      helperMin: helperMin || null,
      helperMax: helperMax || null,
      required,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      showInStats,
      chartType,
    })
    .where(eq(surveyQuestions.id, id))

  revalidateAll()
  revalidatePath("/encuesta")
  return { ok: true, message: "Pregunta actualizada." }
}

export async function toggleSurveyQuestionActive(id: number, active: boolean): Promise<ActionResult> {
  await requireAdmin()
  await db.update(surveyQuestions).set({ active }).where(eq(surveyQuestions.id, id))
  revalidateAll()
  revalidatePath("/encuesta")
  return { ok: true }
}

export async function deleteSurveyQuestion(id: number): Promise<ActionResult> {
  await requireAdmin()
  await db.delete(surveyAnswers).where(eq(surveyAnswers.questionId, id))
  await db.delete(surveyQuestions).where(eq(surveyQuestions.id, id))
  revalidateAll()
  revalidatePath("/encuesta")
  return { ok: true }
}

export async function seedDefaultSurveyQuestions(): Promise<ActionResult> {
  await requireAdmin()

  const existing = await db.select({ label: surveyQuestions.label }).from(surveyQuestions)
  const existingLabels = new Set(existing.map((q) => q.label))

  const toInsert = DEFAULT_SURVEY_QUESTIONS.filter((q) => !existingLabels.has(q.label))
  if (toInsert.length === 0) {
    return { ok: false, message: "Las 7 preguntas ya estaban creadas." }
  }

  let nextSortOrder = existing.length

  for (const q of toInsert) {
    nextSortOrder += 1
    await db.insert(surveyQuestions).values({
      label: q.label,
      type: q.type,
      options: q.options ? q.options.join(", ") : null,
      helperMin: q.helperMin ?? null,
      helperMax: q.helperMax ?? null,
      required: q.required ?? true,
      sortOrder: nextSortOrder,
      active: true,
    })
  }

  revalidateAll()
  revalidatePath("/encuesta")
  return { ok: true, message: `Se crearon ${toInsert.length} pregunta(s).` }
}
