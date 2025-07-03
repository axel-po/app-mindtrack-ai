import db from "@/infrastructure/database/client";
import { habits } from "@/infrastructure/database/schemas/habits.schema";
import { entries } from "@/infrastructure/database/schemas/entries.schema";
import { entryHabits } from "@/infrastructure/database/schemas/entryHabits.schema";
import { eq, and } from "drizzle-orm";
import { Habit, HabitRepository } from "@/domain/models/habit.interface";

export function createHabitRepository(): HabitRepository {
  return {
    async getUserHabits(userId: string) {
      try {
        const userHabits = await db
          .select()
          .from(habits)
          .where(eq(habits.userId, userId));

        return { data: userHabits };
      } catch (error) {
        console.error("Error in getUserHabits repository:", error);
        return { data: [], error: error as Error };
      }
    },

    async createHabit(habitData: Omit<Habit, "id">) {
      try {
        const [newHabit] = await db
          .insert(habits)
          .values(habitData)
          .returning();

        return { data: newHabit };
      } catch (error) {
        console.error("Error in createHabit repository:", error);
        return { data: null, error: error as Error };
      }
    },

    async updateHabit(
      id: string,
      habitData: Partial<Omit<Habit, "id" | "userId">>
    ) {
      try {
        const [updatedHabit] = await db
          .update(habits)
          .set(habitData)
          .where(eq(habits.id, id))
          .returning();

        return { data: updatedHabit || null };
      } catch (error) {
        console.error("Error in updateHabit repository:", error);
        return { data: null, error: error as Error };
      }
    },

    async deleteHabit(id: string) {
      try {
        await db.delete(habits).where(eq(habits.id, id));

        return { success: true };
      } catch (error) {
        console.error("Error in deleteHabit repository:", error);
        return { success: false, error: error as Error };
      }
    },

    async toggleHabitCompletion(habitId: string, userId: string, date: string) {
      try {
        // Check if entry exists for the date
        const existingEntry = await db
          .select()
          .from(entries)
          .where(and(eq(entries.userId, userId), eq(entries.date, date)))
          .limit(1);

        let entryId: string;

        if (existingEntry.length > 0) {
          entryId = existingEntry[0].id;
        } else {
          // Create new entry for the date with neutral mood
          const [newEntry] = await db
            .insert(entries)
            .values({
              userId,
              date,
              mood: "neutral",
              thought: null,
            })
            .returning();
          entryId = newEntry.id;
        }

        // Check if habit is already completed for this entry
        const existingHabitEntry = await db
          .select()
          .from(entryHabits)
          .where(
            and(
              eq(entryHabits.entryId, entryId),
              eq(entryHabits.habitId, habitId)
            )
          )
          .limit(1);

        let isCompleted: boolean;

        if (existingHabitEntry.length > 0) {
          // Remove habit completion
          await db
            .delete(entryHabits)
            .where(
              and(
                eq(entryHabits.entryId, entryId),
                eq(entryHabits.habitId, habitId)
              )
            );
          isCompleted = false;
        } else {
          // Add habit completion
          await db.insert(entryHabits).values({
            entryId,
            habitId,
          });
          isCompleted = true;
        }

        return { success: true, isCompleted };
      } catch (error) {
        console.error("Error in toggleHabitCompletion repository:", error);
        return {
          success: false,
          isCompleted: false,
          error: error as Error,
        };
      }
    },
  };
}
