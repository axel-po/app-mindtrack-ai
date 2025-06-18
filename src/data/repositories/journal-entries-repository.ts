"use server";

import { eq, desc } from "drizzle-orm";
import db from "@/data/db/client";
import { entries, NewEntry } from "@/data/models/entries-model";
import { entryHabits } from "@/data/models/entryHabits-model";
import { habits } from "@/data/models/habits-model";
import { sql } from "drizzle-orm";

export type JournalEntryWithCompletions = {
  id: string;
  userId: string;
  date: string;
  mood: "good" | "neutral" | "sad";
  thought: string | null;
  createdAt: Date | null;
  completedHabits: { id: string; name: string }[];
};

export async function createEntry(input: NewEntry) {
  const { userId, date, mood, thought } = input;

  const [newEntry] = await db
    .insert(entries)
    .values({
      userId,
      date,
      mood,
      thought,
    })
    .returning();

  return newEntry;
}

export async function addHabitsToEntry(entryId: string, habitIds: string[]) {
  if (habitIds.length === 0) return [];

  const values = habitIds.map((habitId) => ({
    entryId,
    habitId,
  }));

  return db.insert(entryHabits).values(values).returning();
}

export async function getEntriesByUserId(userId: string) {
  return db
    .select()
    .from(entries)
    .where(eq(entries.userId, userId))
    .orderBy(desc(entries.date));
}

export async function getEntryById(id: string) {
  const [entry] = await db.select().from(entries).where(eq(entries.id, id));

  return entry;
}

export async function getEntryWithHabits(
  id: string
): Promise<JournalEntryWithCompletions | null> {
  const [entry] = await db.select().from(entries).where(eq(entries.id, id));

  if (!entry) return null;

  const completedHabits = await db
    .select({
      id: habits.id,
      name: habits.name,
    })
    .from(entryHabits)
    .innerJoin(habits, eq(entryHabits.habitId, habits.id))
    .where(eq(entryHabits.entryId, id));

  return {
    ...entry,
    completedHabits,
  };
}

export async function removeHabitFromEntry(entryId: string, habitId: string) {
  return db
    .delete(entryHabits)
    .where(
      sql`${entryHabits.entryId} = ${entryId} AND ${entryHabits.habitId} = ${habitId}`
    );
}

export async function getEntriesWithHabitsByUserId(
  userId: string
): Promise<JournalEntryWithCompletions[]> {
  const userEntries = await db
    .select()
    .from(entries)
    .where(eq(entries.userId, userId))
    .orderBy(desc(entries.date));

  const result: JournalEntryWithCompletions[] = [];

  for (const entry of userEntries) {
    const completedHabits = await db
      .select({
        id: habits.id,
        name: habits.name,
      })
      .from(entryHabits)
      .innerJoin(habits, eq(entryHabits.habitId, habits.id))
      .where(eq(entryHabits.entryId, entry.id));

    result.push({
      ...entry,
      completedHabits,
    });
  }

  return result;
}

export async function updateEntry(id: string, data: Partial<NewEntry>) {
  const [updatedEntry] = await db
    .update(entries)
    .set(data)
    .where(eq(entries.id, id))
    .returning();

  return updatedEntry;
}

export async function deleteEntry(id: string) {
  // This will cascade delete related entryHabits due to foreign key constraints
  return db.delete(entries).where(eq(entries.id, id));
}
