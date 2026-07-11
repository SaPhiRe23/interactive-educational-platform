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

export const eventSettings = pgTable("event_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
})

export type Participant = typeof participants.$inferSelect
export type Activity = typeof activities.$inferSelect
export type MapZone = typeof mapZones.$inferSelect
export type MediaItem = typeof mediaItems.$inferSelect
export type Badge = typeof badges.$inferSelect
export type SurveyResponse = typeof surveyResponses.$inferSelect
