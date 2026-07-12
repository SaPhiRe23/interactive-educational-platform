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
import { asc, count, desc, eq, sql } from "drizzle-orm"

export async function getSettings() {
  const rows = await db.select().from(eventSettings)
  const map: Record<string, string> = {}
  for (const row of rows) {
    if (row.value !== null) map[row.key] = row.value
  }

  const eventNameFromDb = map.event_name?.trim()
  const normalizedEventName =
    eventNameFromDb && /festival del patin[oó]dromo(\s*2026)?/i.test(eventNameFromDb)
      ? "Huellas que Construyen Futuro"
      : eventNameFromDb

  return {
    eventName: normalizedEventName ?? "Huellas que Construyen Futuro",
    eventTagline: map.event_tagline ?? "Fortalecimiento del desarrollo humano y social a través del Patinódromo Distrital de Barranquilla",
    eventDates: map.event_dates ?? "26/06/2026",
    eventLocation: map.event_location ?? "Patinódromo Distrital de Barranquilla",
    registrationOpen: (map.registration_open ?? "true") === "true",
  }
}

export async function getActivities() {
  return db.select().from(activities).orderBy(asc(activities.sortOrder), asc(activities.startsAt))
}

export async function getMapZones() {
  return db.select().from(mapZones).orderBy(asc(mapZones.sortOrder))
}

export async function getMedia() {
  return db.select().from(mediaItems).orderBy(asc(mediaItems.sortOrder))
}

export async function getBadges() {
  return db.select().from(badges).orderBy(asc(badges.sortOrder))
}

export async function getParticipants() {
  return db.select().from(participants).orderBy(desc(participants.createdAt))
}

export async function getParticipantByCode(code: string) {
  const rows = await db.select().from(participants).where(eq(participants.code, code.toUpperCase().trim())).limit(1)
  return rows[0] ?? null
}

export async function getParticipantByEmail(email: string) {
  const rows = await db
    .select()
    .from(participants)
    .where(eq(participants.email, email.toLowerCase().trim()))
    .limit(1)
  return rows[0] ?? null
}

export async function getBadgesForParticipant(participantId: number) {
  return db
    .select({
      id: badges.id,
      name: badges.name,
      description: badges.description,
      icon: badges.icon,
      color: badges.color,
      points: badges.points,
    })
    .from(participantBadges)
    .innerJoin(badges, eq(participantBadges.badgeId, badges.id))
    .where(eq(participantBadges.participantId, participantId))
}

export async function getSurveyResponses() {
  return db.select().from(surveyResponses).orderBy(desc(surveyResponses.createdAt))
}

export async function getStats() {
  const [participantsTotal] = await db.select({ value: count() }).from(participants)
  const [completedTotal] = await db
    .select({ value: count() })
    .from(participants)
    .where(eq(participants.completed, true))
  const [surveyTotal] = await db.select({ value: count() }).from(surveyResponses)
  const [avgRating] = await db
    .select({ value: sql<number>`coalesce(avg(${surveyResponses.overallRating}), 0)` })
    .from(surveyResponses)

  const byCategory = await db
    .select({ category: participants.category, value: count() })
    .from(participants)
    .groupBy(participants.category)

  const byCity = await db
    .select({ city: participants.city, value: count() })
    .from(participants)
    .groupBy(participants.city)
    .orderBy(desc(count()))

  const registrationsByDay = await db
    .select({
      day: sql<string>`to_char(${participants.createdAt}, 'YYYY-MM-DD')`,
      value: count(),
    })
    .from(participants)
    .groupBy(sql`to_char(${participants.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${participants.createdAt}, 'YYYY-MM-DD')`)

  const ratingDistribution = await db
    .select({ rating: surveyResponses.overallRating, value: count() })
    .from(surveyResponses)
    .groupBy(surveyResponses.overallRating)
    .orderBy(asc(surveyResponses.overallRating))

  const [recommendCount] = await db
    .select({ value: count() })
    .from(surveyResponses)
    .where(eq(surveyResponses.wouldRecommend, true))

  const [badgesAwarded] = await db.select({ value: count() }).from(participantBadges)

  return {
    participantsTotal: participantsTotal?.value ?? 0,
    completedTotal: completedTotal?.value ?? 0,
    surveyTotal: surveyTotal?.value ?? 0,
    avgRating: Number(avgRating?.value ?? 0),
    recommendCount: recommendCount?.value ?? 0,
    badgesAwarded: badgesAwarded?.value ?? 0,
    byCategory: byCategory.map((r) => ({ name: r.category, value: r.value })),
    byCity: byCity.filter((r) => r.city).map((r) => ({ name: r.city as string, value: r.value })),
    registrationsByDay: registrationsByDay.map((r) => ({ day: r.day, value: r.value })),
    ratingDistribution: ratingDistribution.map((r) => ({ rating: r.rating, value: r.value })),
  }
}
