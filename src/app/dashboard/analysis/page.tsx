import { getUser } from "@/lib/auth-server";
import { getMoodDistribution, getActivityOverview } from "@/userinterface/actions/analytics.actions";
import { getUserStreakAction } from "@/userinterface/actions/streak.actions";
import { MoodDistributionChart } from "@/userinterface/components/analytics/mood-distribution-chart";
import { MoodTrendsChart } from "@/userinterface/components/analytics/mood-trends-chart";
import { HabitCompletionChart } from "@/userinterface/components/analytics/habit-completion-chart";
import { HabitStreakChart } from "@/userinterface/components/analytics/habit-streak-chart";
import { ActivityOverviewChart } from "@/userinterface/components/analytics/activity-overview-chart";
import { WeeklyHeatmap } from "@/userinterface/components/analytics/weekly-heatmap";

import { unauthorized } from "next/navigation";
import React from "react";

export default async function AnalysesPage() {
  const user = await getUser();

  if (!user) {
    return unauthorized();
  }

  // Fetch real data
  const [moodDistribution, activityOverview, streakData] = await Promise.all([
    getMoodDistribution(),
    getActivityOverview(),
    getUserStreakAction(user.id),
  ]);

  // Mock data for charts that don't have backend implementation yet
  const mockMoodTrends = [
    { date: "2024-01-01", good: 5, neutral: 3, sad: 2 },
    { date: "2024-01-02", good: 6, neutral: 2, sad: 1 },
    { date: "2024-01-03", good: 4, neutral: 4, sad: 2 },
    { date: "2024-01-04", good: 7, neutral: 2, sad: 1 },
    { date: "2024-01-05", good: 5, neutral: 3, sad: 2 },
    { date: "2024-01-06", good: 8, neutral: 1, sad: 1 },
    { date: "2024-01-07", good: 6, neutral: 3, sad: 1 },
  ];

  const mockHabitCompletion = [
    { habitName: "Méditation", completionRate: 85, totalEntries: 20, completedEntries: 17 },
    { habitName: "Exercice", completionRate: 72, totalEntries: 25, completedEntries: 18 },
    { habitName: "Lecture", completionRate: 60, totalEntries: 15, completedEntries: 9 },
    { habitName: "Hydratation", completionRate: 93, totalEntries: 30, completedEntries: 28 },
    { habitName: "Sommeil", completionRate: 45, totalEntries: 22, completedEntries: 10 },
  ];

  const mockStreakData = [
    { date: "2024-01-01", currentStreak: 1, highestStreak: 5 },
    { date: "2024-01-02", currentStreak: 2, highestStreak: 5 },
    { date: "2024-01-03", currentStreak: 3, highestStreak: 5 },
    { date: "2024-01-04", currentStreak: 4, highestStreak: 5 },
    { date: "2024-01-05", currentStreak: 5, highestStreak: 5 },
    { date: "2024-01-06", currentStreak: 0, highestStreak: 5 },
    { date: "2024-01-07", currentStreak: 1, highestStreak: 5 },
  ];

  const mockHeatmapData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 6),
      activities: Math.floor(Math.random() * 5),
    };
  });

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Analyses</h1>
        <p className="text-muted-foreground">
          Visualisez vos progrès et découvrez vos tendances
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Overview - Full width on top */}
        <div className="lg:col-span-3">
          <ActivityOverviewChart data={activityOverview.data} />
        </div>

        {/* Mood Charts */}
        <div className="lg:col-span-2">
          <MoodTrendsChart data={mockMoodTrends} />
        </div>
        <div className="lg:col-span-1">
          <MoodDistributionChart data={moodDistribution.data} />
        </div>

        {/* Habit Charts */}
        <div className="lg:col-span-2">
          <HabitCompletionChart data={mockHabitCompletion} />
        </div>
        <div className="lg:col-span-1">
          <HabitStreakChart 
            data={mockStreakData} 
            currentStreak={streakData.currentStreak}
            highestStreak={streakData.highestStreak}
          />
        </div>

        {/* Heatmap - Full width at bottom */}
        <div className="lg:col-span-3">
          <WeeklyHeatmap 
            data={mockHeatmapData}
            title="Calendrier d'activité"
            description="Votre activité quotidienne des 30 derniers jours"
          />
        </div>
      </div>
    </div>
  );
}
