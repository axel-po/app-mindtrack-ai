"use server";

import db from "@/data/db/client";
import { habits } from "@/data/models/habits-model";
import { HabitModel, NewHabitModel } from "@/types/habit-types";
import { eq } from "drizzle-orm";

export async function getHabitsByUserId(userId: string) {
  return db.select().from(habits).where(eq(habits.userId, userId));
}

export async function createHabit(habit: NewHabitModel) {
  return db.insert(habits).values(habit).returning();
}

export async function updateHabit(habit: HabitModel) {
  return db
    .update(habits)
    .set(habit)
    .where(eq(habits.id, habit.id))
    .returning();
}

export async function deleteHabit(id: string) {
  return db.delete(habits).where(eq(habits.id, id)).returning();
}
