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
import { asc, count, desc, eq, inArray, sql } from "drizzle-orm"

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

export async function getActiveSurveyQuestions() {
  return db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.active, true))
    .orderBy(asc(surveyQuestions.sortOrder))
}

export async function getAllSurveyQuestions() {
  return db.select().from(surveyQuestions).orderBy(asc(surveyQuestions.sortOrder))
}

export async function getSurveyResponsesWithAnswers() {
  const responses = await db.select().from(surveyResponses).orderBy(desc(surveyResponses.createdAt))
  if (responses.length === 0) return []

  const questions = await db.select().from(surveyQuestions)
  const questionsById = new Map(questions.map((q) => [q.id, q]))

  const answers = await db
    .select()
    .from(surveyAnswers)
    .where(
      inArray(
        surveyAnswers.responseId,
        responses.map((r) => r.id),
      ),
    )

  const answersByResponse = new Map<number, { question: string; type: string; value: string }[]>()
  for (const answer of answers) {
    const question = questionsById.get(answer.questionId)
    if (!question) continue
    const list = answersByResponse.get(answer.responseId) ?? []
    list.push({ question: question.label, type: question.type, value: answer.value ?? "" })
    answersByResponse.set(answer.responseId, list)
  }

  return responses.map((response) => ({
    ...response,
    answers: answersByResponse.get(response.id) ?? [],
  }))
}

export type QuestionStatResult =
  | {
      id: number
      label: string
      type: "text"
      chartType: string
      responses: string[]
    }
  | {
      id: number
      label: string
      type: "stars" | "yesno" | "single_choice" | "multi_choice"
      chartType: string
      data: { name: string; value: number }[]
    }

export async function getSurveyQuestionStats(): Promise<QuestionStatResult[]> {
  const questions = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.showInStats, true))
    .orderBy(asc(surveyQuestions.sortOrder))

  if (questions.length === 0) return []

  const answers = await db
    .select()
    .from(surveyAnswers)
    .where(
      inArray(
        surveyAnswers.questionId,
        questions.map((q) => q.id),
      ),
    )

  const answersByQuestion = new Map<number, string[]>()
  for (const answer of answers) {
    if (!answer.value) continue
    const list = answersByQuestion.get(answer.questionId) ?? []
    list.push(answer.value)
    answersByQuestion.set(answer.questionId, list)
  }

  return questions.map((question): QuestionStatResult => {
    const values = answersByQuestion.get(question.id) ?? []

    if (question.type === "text") {
      return {
        id: question.id,
        label: question.label,
        type: "text",
        chartType: question.chartType,
        responses: values.slice(0, 50),
      }
    }

    if (question.type === "stars") {
      const counts = new Map([1, 2, 3, 4, 5].map((n) => [String(n), 0]))
      for (const v of values) {
        if (counts.has(v)) counts.set(v, (counts.get(v) ?? 0) + 1)
      }
      return {
        id: question.id,
        label: question.label,
        type: question.type,
        chartType: question.chartType,
        data: Array.from(counts.entries()).map(([name, value]) => ({ name: `${name} ★`, value })),
      }
    }

    if (question.type === "multi_choice") {
      const options = (question.options ?? "").split(",").map((o) => o.trim()).filter(Boolean)
      const counts = new Map(options.map((o) => [o, 0]))
      for (const v of values) {
        for (const part of v.split("|").map((p) => p.trim())) {
          if (counts.has(part)) counts.set(part, (counts.get(part) ?? 0) + 1)
        }
      }
      return {
        id: question.id,
        label: question.label,
        type: question.type,
        chartType: question.chartType,
        data: Array.from(counts.entries()).map(([name, value]) => ({ name, value })),
      }
    }

    // yesno and single_choice: count exact-match values, preserving declared option order when available
    const declaredOptions = (question.options ?? "").split(",").map((o) => o.trim()).filter(Boolean)
    const counts = new Map<string, number>()
    const order = declaredOptions.length > 0 ? declaredOptions : []
    for (const opt of order) counts.set(opt, 0)
    for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)

    return {
      id: question.id,
      label: question.label,
      type: question.type as "yesno" | "single_choice",
      chartType: question.chartType,
      data: Array.from(counts.entries()).map(([name, value]) => ({ name, value })),
    }
  })
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
  const [activitiesTotal] = await db.select({ value: count() }).from(activities)

  return {
    participantsTotal: participantsTotal?.value ?? 0,
    activitiesTotal: activitiesTotal?.value ?? 0,
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

export const STAT_METRICS = [
  { key: "participantsTotal", label: "Participantes" },
  { key: "activitiesTotal", label: "Actividades" },
  { key: "completedTotal", label: "Completados" },
  { key: "badgesAwarded", label: "Insignias otorgadas" },
  { key: "surveyTotal", label: "Opiniones" },
  { key: "avgRating", label: "Calificación promedio" },
  { key: "recommendCount", label: "Recomendarían el evento" },
] as const

export type StatMetricKey = (typeof STAT_METRICS)[number]["key"]

export async function getStatSettings() {
  const rows = await db.select().from(eventSettings)
  const map: Record<string, string> = {}
  for (const row of rows) {
    if (row.value !== null) map[row.key] = row.value
  }
  return map
}

export async function getPublicStats() {
  const raw = await getStats()
  const settings = await getStatSettings()

  const rawValues: Record<StatMetricKey, number> = {
    participantsTotal: raw.participantsTotal,
    activitiesTotal: raw.activitiesTotal,
    completedTotal: raw.completedTotal,
    badgesAwarded: raw.badgesAwarded,
    surveyTotal: raw.surveyTotal,
    avgRating: raw.avgRating,
    recommendCount: raw.recommendCount,
  }

  const metrics = STAT_METRICS.map(({ key, label }) => {
    const overrideRaw = settings[`stat_override_${key}`]
    const hasOverride = overrideRaw !== undefined && overrideRaw.trim() !== ""
    const visible = (settings[`stat_visible_${key}`] ?? "true") !== "false"
    const rawValue = rawValues[key]
    const value = hasOverride ? Number(overrideRaw) : rawValue

    return {
      key,
      label,
      value: Number.isFinite(value) ? value : rawValue,
      rawValue,
      visible,
      overridden: hasOverride,
    }
  })

  return { metrics }
}
