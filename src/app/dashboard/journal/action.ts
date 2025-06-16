"use server";

import {
  addJournalEntry as addJournalEntryService,
  toggleHabitCompletion as toggleHabitCompletionService,
} from "@/services/journal-entries-service";
import { NewJournalEntry } from "@/types/journal-entries-types";
import { revalidatePath } from "next/cache";

export async function createJournalEntry(
  entry: NewJournalEntry,
  habitIds?: string[]
) {
  try {
    const result = await addJournalEntryService(entry, habitIds);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/journal");
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création de l'entrée de journal",
    };
  }
}

export async function toggleHabitCompletion(
  entryId: string,
  habitId: string,
  completed: boolean
) {
  try {
    await toggleHabitCompletionService(entryId, habitId, completed);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/journal");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour des habitudes",
    };
  }
}
