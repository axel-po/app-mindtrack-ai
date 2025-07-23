"use server";

import { createAnalyticsUseCase } from "@/di/analytics.ioc";
import { getUser } from "@/lib/auth-server";
import { MoodAnalytics } from "@/domain/usecases/analytics.usecase";

export async function getMoodAnalytics(
  months: number = 6
): Promise<{ data: MoodAnalytics[]; error?: string }> {
  try {
    const user = await getUser();
    if (!user) {
      return { data: [], error: "User not authenticated" };
    }

    const analyticsUseCase = createAnalyticsUseCase();
    const result = await analyticsUseCase.getMoodAnalyticsByUserId(
      user.id,
      months
    );

    if (result.error) {
      return { data: [], error: result.error.message };
    }

    return { data: result.data };
  } catch (error) {
    console.error("Error in getMoodAnalytics action:", error);
    return { data: [], error: "Failed to fetch mood analytics" };
  }
}

export async function getMoodDistribution(): Promise<{
  data: { mood: string; count: number; percentage: number }[];
  error?: string;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { data: [], error: "User not authenticated" };
    }

    const analyticsUseCase = createAnalyticsUseCase();
    const result = await analyticsUseCase.getMoodDistributionByUserId(user.id);

    if (result.error) {
      return { data: [], error: result.error.message };
    }

    return { data: result.data };
  } catch (error) {
    console.error("Error in getMoodDistribution action:", error);
    return { data: [], error: "Failed to fetch mood distribution" };
  }
}

export async function getActivityOverview(): Promise<{
  data: {
    totalJournalEntries: number;
    totalHabits: number;
    averageCompletionRate: number;
    entriesThisWeek: number;
    entriesLastWeek: number;
    activeHabits: number;
  };
  error?: string;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { 
        data: {
          totalJournalEntries: 0,
          totalHabits: 0,
          averageCompletionRate: 0,
          entriesThisWeek: 0,
          entriesLastWeek: 0,
          activeHabits: 0,
        }, 
        error: "User not authenticated" 
      };
    }

    // Mock data for now - would be implemented in analytics use case
    const mockData = {
      totalJournalEntries: 45,
      totalHabits: 8,
      averageCompletionRate: 72.5,
      entriesThisWeek: 5,
      entriesLastWeek: 3,
      activeHabits: 6,
    };

    return { data: mockData };
  } catch (error) {
    console.error("Error in getActivityOverview action:", error);
    return { 
      data: {
        totalJournalEntries: 0,
        totalHabits: 0,
        averageCompletionRate: 0,
        entriesThisWeek: 0,
        entriesLastWeek: 0,
        activeHabits: 0,
      }, 
      error: "Failed to fetch activity overview" 
    };
  }
}
