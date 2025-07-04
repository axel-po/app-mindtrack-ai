import { JournalRepository } from "@/domain/models/journal.interface";

export interface MoodAnalytics {
  period: string;
  good: number;
  neutral: number;
  sad: number;
  total: number;
}

export class AnalyticsUseCase {
  constructor(private journalRepository: JournalRepository) {}

  async getMoodAnalyticsByUserId(
    userId: string,
    months: number = 6
  ): Promise<{ data: MoodAnalytics[]; error?: Error }> {
    try {
      const result = await this.journalRepository.getJournalsByUserIdWithHabits(
        userId
      );

      if (result.error) {
        return { data: [], error: result.error };
      }

      // Filter entries from the last X months
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - months);

      const recentEntries = result.data.filter(
        (entry) => new Date(entry.date) >= cutoffDate
      );

      // Group by month and count moods
      const monthlyData = new Map<
        string,
        { good: number; neutral: number; sad: number }
      >();

      recentEntries.forEach((entry) => {
        const date = new Date(entry.date);
        const monthKey = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { good: 0, neutral: 0, sad: 0 });
        }

        const monthStats = monthlyData.get(monthKey)!;
        monthStats[entry.mood as keyof typeof monthStats]++;
      });

      // Convert to array format for chart
      const analytics: MoodAnalytics[] = Array.from(monthlyData.entries()).map(
        ([period, moods]) => ({
          period,
          good: moods.good,
          neutral: moods.neutral,
          sad: moods.sad,
          total: moods.good + moods.neutral + moods.sad,
        })
      );

      // Sort by date
      analytics.sort((a, b) => {
        const dateA = new Date(a.period);
        const dateB = new Date(b.period);
        return dateA.getTime() - dateB.getTime();
      });

      return { data: analytics };
    } catch (error) {
      console.error("Error in getMoodAnalyticsByUserId usecase:", error);
      return { data: [], error: error as Error };
    }
  }

  async getMoodDistributionByUserId(
    userId: string
  ): Promise<{
    data: { mood: string; count: number; percentage: number }[];
    error?: Error;
  }> {
    try {
      const result = await this.journalRepository.getJournalsByUserIdWithHabits(
        userId
      );

      if (result.error) {
        return { data: [], error: result.error };
      }

      const moodCounts = { good: 0, neutral: 0, sad: 0 };
      result.data.forEach((entry) => {
        moodCounts[entry.mood as keyof typeof moodCounts]++;
      });

      const total = result.data.length;
      const distribution = Object.entries(moodCounts).map(([mood, count]) => ({
        mood,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }));

      return { data: distribution };
    } catch (error) {
      console.error("Error in getMoodDistributionByUserId usecase:", error);
      return { data: [], error: error as Error };
    }
  }
}
