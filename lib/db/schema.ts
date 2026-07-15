import { boolean, integer, pgTable, real, serial, text, timestamp } from "drizzle-orm/pg-core"

export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  category: text("category").notNull().default("espectador"),
  city: text("city"),
  code: text("code").notNull().unique(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  dayLabel: text("day_label"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const mapZones = pgTable("map_zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull().default("map-pin"),
  color: text("color").notNull().default("primary"),
  posX: real("pos_x").notNull().default(50),
  posY: real("pos_y").notNull().default(50),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("photo"),
  title: text("title"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull().default("award"),
  color: text("color").notNull().default("primary"),
  points: integer("points").notNull().default(10),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const participantBadges = pgTable("participant_badges", {
  id: serial("id").primaryKey(),
  participantId: integer("participant_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
})

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  overallRating: integer("overall_rating").notNull(),
  organizationRating: integer("organization_rating"),
  venueRating: integer("venue_rating"),
  wouldRecommend: boolean("would_recommend"),
  favoriteActivity: text("favorite_activity"),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const surveyQuestions = pgTable("survey_questions", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  // 'stars' | 'yesno' | 'single_choice' | 'multi_choice' | 'text'
  type: text("type").notNull(),
  options: text("options"), // comma-separated labels; only used for single_choice / multi_choice
  helperMin: text("helper_min"), // e.g. "Nada" — shown next to the 1-star option
  helperMax: text("helper_max"), // e.g. "Muchísimo" — shown next to the 5-star option
  required: boolean("required").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  showInStats: boolean("show_in_stats").notNull().default(false),
  // 'bar' | 'donut' | 'table' — ignored for 'text' questions, which always show as a list
  chartType: text("chart_type").notNull().default("bar"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const surveyAnswers = pgTable("survey_answers", {
  id: serial("id").primaryKey(),
  responseId: integer("response_id")
    .notNull()
    .references(() => surveyResponses.id, { onDelete: "cascade" }),
  questionId: integer("question_id")
    .notNull()
    .references(() => surveyQuestions.id, { onDelete: "cascade" }),
  // Stores the answer as text regardless of question type:
  // stars -> "1".."5", yesno -> "yes"/"no", single_choice -> the chosen label,
  // multi_choice -> labels joined with " | ", text -> the free-text answer.
  value: text("value"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const eventSettings = pgTable("event_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
})

export const huellas = pgTable("huellas", {
  id: serial("id").primaryKey(),
  texto: text("texto").notNull(),
  posX: real("pos_x").notNull().default(50),
  posY: real("pos_y").notNull().default(50),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

// Momento 5 "El reto del futuro": proposals written by visitors, grouped by challenge.
// Momento 6 "Decisión colectiva" reuses these same rows and lets visitors vote on them.
export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  reto: text("reto").notNull(),
  texto: text("texto").notNull(),
  votos: integer("votos").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Participant = typeof participants.$inferSelect
export type Activity = typeof activities.$inferSelect
export type MapZone = typeof mapZones.$inferSelect
export type MediaItem = typeof mediaItems.$inferSelect
export type Badge = typeof badges.$inferSelect
export type SurveyQuestion = typeof surveyQuestions.$inferSelect
export type SurveyAnswer = typeof surveyAnswers.$inferSelect
export type SurveyResponse = typeof surveyResponses.$inferSelect
export type Huella = typeof huellas.$inferSelect
export type Idea = typeof ideas.$inferSelect
