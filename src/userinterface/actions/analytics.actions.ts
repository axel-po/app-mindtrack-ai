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
