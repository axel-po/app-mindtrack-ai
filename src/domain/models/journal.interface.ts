import { entries } from "@/infrastructure/database/schemas/entries.schema";
import { Habit } from "@/domain/models/habit.interface";

// Use the inferred type from Drizzle schema
export type Journal = typeof entries.$inferSelect & {
  habits: Habit[];
};

// Repository interface
export interface JournalRepository {
  getJournalsByUserIdWithHabits(
    userId: string
  ): Promise<{ data: Journal[]; error?: Error }>;

  getJournalById(id: string): Promise<{ data: Journal | null; error?: Error }>;

  createJournal(
    journal: Omit<Journal, "id" | "createdAt"> & { habitIds?: string[] }
  ): Promise<{ data: Journal | null; error?: Error }>;

  updateJournal(
    id: string,
    journalData: Partial<Omit<Journal, "id" | "userId" | "createdAt">> & {
      habitIds?: string[];
    }
  ): Promise<{ data: Journal | null; error?: Error }>;

  deleteJournal(id: string): Promise<{ success: boolean; error?: Error }>;
}
