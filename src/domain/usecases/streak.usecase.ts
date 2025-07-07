import { Journal } from "@/domain/models/journal.interface";

export class StreakUseCase {
  /**
   * Calculate the current streak of consecutive days with journal entries
   * @param journals Array of journal entries sorted by date (newest first)
   * @returns The number of consecutive days with journal entries
   */
  calculateCurrentStreak(journals: Journal[]): number {
    if (!journals || journals.length === 0) {
      return 0;
    }

    // Sort journals by date in descending order (newest first)
    const sortedJournals = [...journals].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Get today's date at the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the most recent journal entry is from today
    const mostRecentDate = new Date(sortedJournals[0].date);
    mostRecentDate.setHours(0, 0, 0, 0);

    // If the most recent entry is not from today or yesterday, streak is 0
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (mostRecentDate < yesterday) {
      return 0;
    }

    // Initialize streak counter
    let streak = 0;
    const currentDate =
      mostRecentDate.getTime() === today.getTime() ? today : yesterday;

    // Create a map of dates with journal entries for quick lookup
    const journalDates = new Map<string, boolean>();
    sortedJournals.forEach((journal) => {
      const dateStr = new Date(journal.date).toISOString().split("T")[0];
      journalDates.set(dateStr, true);
    });

    // Count consecutive days
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];

      if (journalDates.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Get the highest streak achieved
   * @param journals Array of journal entries
   * @returns The highest streak achieved
   */
  calculateHighestStreak(journals: Journal[]): number {
    if (!journals || journals.length === 0) {
      return 0;
    }

    // Sort journals by date in ascending order (oldest first)
    const sortedJournals = [...journals].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    let maxStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedJournals.length; i++) {
      const prevDate = new Date(sortedJournals[i - 1].date);
      const currDate = new Date(sortedJournals[i].date);

      // Calculate the difference in days
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        currentStreak++;
      } else {
        // Streak broken
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }

    // Check if the current streak is the max streak
    maxStreak = Math.max(maxStreak, currentStreak);

    return maxStreak;
  }
}

// Factory function for easier dependency injection
export const createStreakUseCase = (): StreakUseCase => {
  return new StreakUseCase();
};
