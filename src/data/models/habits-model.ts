import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { user } from "./user-model";

export const habits = pgTable("habit", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  emoji: text("emoji"),
});

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
