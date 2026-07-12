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
  surveyResponses,
} from "@/lib/db/schema"
import { isAdmin } from "@/lib/admin-auth"

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
