import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { entries } from "./entries.schema";
import { habits } from "./habits.schema";

export const entryHabits = pgTable(
  "entry_habit",
  {
    entryId: uuid("entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    habitId: uuid("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.entryId, table.habitId] }),
  })
);

export type EntryHabit = typeof entryHabits.$inferSelect;
export type NewEntryHabit = typeof entryHabits.$inferInsert;
