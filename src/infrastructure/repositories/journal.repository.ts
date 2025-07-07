import {
  JournalRepository,
  Journal,
} from "../../domain/models/journal.interface";
import { Habit } from "@/domain/models/habit.interface";
import db from "@/infrastructure/database/client";
import { entries } from "@/infrastructure/database/schemas/entries.schema";
import { habits } from "@/infrastructure/database/schemas/habits.schema";
import { entryHabits } from "@/infrastructure/database/schemas/entryHabits.schema";
import { eq, desc, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export class JournalRepositoryImpl implements JournalRepository {
  // Get all journals for a user with their habits
  async getJournalsByUserIdWithHabits(
    userId: string
  ): Promise<{ data: Journal[]; error?: Error }> {
    try {
      // Fetch all entries for the user
      const userEntries = await db
        .select()
        .from(entries)
        .where(eq(entries.userId, userId))
        .orderBy(desc(entries.date));

      if (userEntries.length === 0) {
        return { data: [] };
      }

      // Get all entry IDs
      const entryIds = userEntries.map((entry) => entry.id);

      // Get all habit relations for these entries in a single query
      const allEntryHabitsRelations = await db
        .select()
        .from(entryHabits)
        .where(inArray(entryHabits.entryId, entryIds));

      // Get unique habit IDs from relations
      const habitIds = [
        ...new Set(allEntryHabitsRelations.map((relation) => relation.habitId)),
      ];

      // Fetch all habits in a single query
      const allHabits =
        habitIds.length > 0
          ? await db.select().from(habits).where(inArray(habits.id, habitIds))
          : [];

      // Create a map of habits for quick lookup
      const habitsMap = new Map<string, Habit>();
      allHabits.forEach((habit) => {
        habitsMap.set(habit.id, {
          id: habit.id,
          name: habit.name,
          userId: habit.userId,
          description: habit.description || null,
          emoji: habit.emoji || null,
        });
      });

      // Create a map of entry ID to habits
      const entryHabitsMap = new Map<string, Habit[]>();
      allEntryHabitsRelations.forEach((relation) => {
        const habit = habitsMap.get(relation.habitId);
        if (habit) {
          if (!entryHabitsMap.has(relation.entryId)) {
            entryHabitsMap.set(relation.entryId, []);
          }
          entryHabitsMap.get(relation.entryId)?.push(habit);
        }
      });

      // Build the final result
      const journalsWithHabits: Journal[] = userEntries.map((entry) => ({
        id: entry.id,
        userId: entry.userId,
        date: entry.date,
        mood: entry.mood,
        thought: entry.thought || null,
        createdAt: entry.createdAt || new Date(),
        habits: entryHabitsMap.get(entry.id) || [],
      }));

      return { data: journalsWithHabits };
    } catch (error) {
      console.error(
        "Repository error in getJournalsByUserIdWithHabits:",
        error
      );
      return { data: [], error: error as Error };
    }
  }

  async getJournalById(
    id: string
  ): Promise<{ data: Journal | null; error?: Error }> {
    try {
      // Fetch the entry
      const entry = await db
        .select()
        .from(entries)
        .where(eq(entries.id, id))
        .limit(1);

      if (entry.length === 0) {
        return { data: null };
      }

      // Get habits for this entry
      const entryHabitsRelations = await db
        .select()
        .from(entryHabits)
        .where(eq(entryHabits.entryId, id));

      // Get habit IDs
      const habitIds = entryHabitsRelations.map((relation) => relation.habitId);

      // Fetch habits
      const journalHabits =
        habitIds.length > 0
          ? await db.select().from(habits).where(inArray(habits.id, habitIds))
          : [];

      // Build the journal with habits
      const journal: Journal = {
        ...entry[0],
        habits: journalHabits.map((habit) => ({
          id: habit.id,
          userId: habit.userId,
          name: habit.name,
          description: habit.description || null,
          emoji: habit.emoji || null,
        })),
      };

      return { data: journal };
    } catch (error) {
      console.error("Repository error in getJournalById:", error);
      return { data: null, error: error as Error };
    }
  }

  async createJournal(
    journal: Omit<Journal, "id" | "createdAt"> & { habitIds?: string[] }
  ): Promise<{ data: Journal | null; error?: Error }> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Generate a new ID
        const id = uuidv4();

        // Create the entry
        const newEntry = await tx
          .insert(entries)
          .values({
            id,
            userId: journal.userId,
            date: journal.date,
            mood: journal.mood,
            thought: journal.thought,
            createdAt: new Date(),
          })
          .returning();

        if (!newEntry || newEntry.length === 0) {
          throw new Error("Failed to create journal entry");
        }

        // If there are habits, create the relationships
        if (journal.habitIds && journal.habitIds.length > 0) {
          await tx.insert(entryHabits).values(
            journal.habitIds.map((habitId) => ({
              id: uuidv4(),
              entryId: id,
              habitId,
            }))
          );

          // Fetch the habits for the response
          const habitsData = await tx
            .select()
            .from(habits)
            .where(inArray(habits.id, journal.habitIds));

          // Return the created journal with habits
          return {
            data: {
              ...newEntry[0],
              habits: habitsData.map((habit) => ({
                id: habit.id,
                userId: habit.userId,
                name: habit.name,
                description: habit.description || null,
                emoji: habit.emoji || null,
              })),
            },
          };
        }

        // Return the created journal without habits
        return {
          data: {
            ...newEntry[0],
            habits: [],
          },
        };
      });
    } catch (error) {
      console.error("Repository error in createJournal:", error);
      return { data: null, error: error as Error };
    }
  }

  async updateJournal(
    id: string,
    journalData: Partial<Omit<Journal, "id" | "userId" | "createdAt">> & {
      habitIds?: string[];
    }
  ): Promise<{ data: Journal | null; error?: Error }> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Get the existing journal to ensure it exists
        const existingEntry = await tx
          .select()
          .from(entries)
          .where(eq(entries.id, id))
          .limit(1);

        if (existingEntry.length === 0) {
          return { data: null, error: new Error("Journal entry not found") };
        }

        // Update the entry
        const updateData: Record<string, unknown> = {};
        if (journalData.date !== undefined) updateData.date = journalData.date;
        if (journalData.mood !== undefined) updateData.mood = journalData.mood;
        if (journalData.thought !== undefined)
          updateData.thought = journalData.thought;

        // Only update if there are fields to update
        if (Object.keys(updateData).length > 0) {
          await tx.update(entries).set(updateData).where(eq(entries.id, id));
        }

        // If habitIds is provided, update the habits relationship
        if (journalData.habitIds !== undefined) {
          // Delete existing relationships
          await tx.delete(entryHabits).where(eq(entryHabits.entryId, id));

          // Add new relationships if there are habits
          if (journalData.habitIds.length > 0) {
            await tx.insert(entryHabits).values(
              journalData.habitIds.map((habitId) => ({
                id: uuidv4(),
                entryId: id,
                habitId,
              }))
            );
          }
        }

        // Fetch the updated entry
        const updatedEntry = await tx
          .select()
          .from(entries)
          .where(eq(entries.id, id))
          .limit(1);

        // Fetch the habits for the response
        const entryHabitsRelations = await tx
          .select()
          .from(entryHabits)
          .where(eq(entryHabits.entryId, id));

        const habitIds = entryHabitsRelations.map(
          (relation) => relation.habitId
        );

        const habitsData =
          habitIds.length > 0
            ? await tx.select().from(habits).where(inArray(habits.id, habitIds))
            : [];

        // Return the updated journal with habits
        return {
          data: {
            ...updatedEntry[0],
            habits: habitsData.map((habit) => ({
              id: habit.id,
              userId: habit.userId,
              name: habit.name,
              description: habit.description || null,
              emoji: habit.emoji || null,
            })),
          },
        };
      });
    } catch (error) {
      console.error("Repository error in updateJournal:", error);
      return { data: null, error: error as Error };
    }
  }

  async deleteJournal(
    id: string
  ): Promise<{ success: boolean; error?: Error }> {
    try {
      console.log("JournalRepositoryImpl.deleteJournal called with ID:", id);
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Delete habit relationships first (foreign key constraint)
        const deletedRelations = await tx
          .delete(entryHabits)
          .where(eq(entryHabits.entryId, id))
          .returning();
        console.log("Deleted habit relations:", deletedRelations.length);

        // Delete the entry
        const result = await tx
          .delete(entries)
          .where(eq(entries.id, id))
          .returning({ id: entries.id });

        console.log("Deleted journal entries:", result);
        return { success: result.length > 0 };
      });
    } catch (error) {
      console.error("Repository error in deleteJournal:", error);
      return { success: false, error: error as Error };
    }
  }
}

// Factory function for easier dependency injection
export const createJournalRepository = (): JournalRepository => {
  return new JournalRepositoryImpl();
};
