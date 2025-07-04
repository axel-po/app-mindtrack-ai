import { Journal, JournalRepository } from "@/domain/models/journal.interface";

export class JournalUseCase {
  constructor(private repository: JournalRepository) {}

  async getJournalsByUserId(
    userId: string
  ): Promise<{ data: Journal[]; error?: Error }> {
    try {
      const result = await this.repository.getJournalsByUserIdWithHabits(
        userId
      );
      return result;
    } catch (error) {
      console.error("Error in getJournalsByUserId usecase:", error);
      return { data: [], error: error as Error };
    }
  }

  async getJournalById(
    id: string
  ): Promise<{ data: Journal | null; error?: Error }> {
    try {
      const result = await this.repository.getJournalById(id);
      return result;
    } catch (error) {
      console.error("Error in getJournalById usecase:", error);
      return { data: null, error: error as Error };
    }
  }

  async createJournal(
    journalData: Omit<Journal, "id" | "createdAt"> & { habitIds?: string[] }
  ): Promise<{ data: Journal | null; error?: Error }> {
    try {
      // Validate journal data
      if (!journalData.userId || !journalData.date || !journalData.mood) {
        return {
          data: null,
          error: new Error("Invalid journal data: missing required fields"),
        };
      }

      // Validate mood is one of the allowed values
      if (!["good", "neutral", "sad"].includes(journalData.mood as string)) {
        return {
          data: null,
          error: new Error("Invalid journal data: invalid mood value"),
        };
      }

      const result = await this.repository.createJournal(journalData);
      return result;
    } catch (error) {
      console.error("Error in createJournal usecase:", error);
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
      const result = await this.repository.updateJournal(id, journalData);
      return result;
    } catch (error) {
      console.error("Error in updateJournal usecase:", error);
      return { data: null, error: error as Error };
    }
  }

  async deleteJournal(
    id: string
  ): Promise<{ success: boolean; error?: Error }> {
    try {
      const result = await this.repository.deleteJournal(id);
      return result;
    } catch (error) {
      console.error("Error in deleteJournal usecase:", error);
      return { success: false, error: error as Error };
    }
  }
}
