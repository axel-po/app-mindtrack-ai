"use server";

import { streakContainer } from "@/di/streak.ioc";
import { journalContainer } from "@/di/journal.ioc";

export async function getUserStreakAction(userId: string) {
  try {
    // Get all journals for the user
    const { data: journals, error: journalError } =
      await journalContainer.journalUseCase.getJournalsByUserId(userId);

    if (journalError) {
      console.error("Error in getUserStreakAction:", journalError);
      return {
        currentStreak: 0,
        highestStreak: 0,
        error: journalError.message,
      };
    }

    // Calculate streaks
    const currentStreak =
      streakContainer.streakUseCase.calculateCurrentStreak(journals);
    const highestStreak =
      streakContainer.streakUseCase.calculateHighestStreak(journals);

    return {
      currentStreak,
      highestStreak,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error in getUserStreakAction:", error);
    return {
      currentStreak: 0,
      highestStreak: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
