import {
  pgTable,
  text,
  timestamp,
  date,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const moodEnum = pgEnum("mood_type", ["good", "neutral", "sad"]);

export const entries = pgTable("entry", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  mood: moodEnum("mood").notNull(),
  thought: text(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
