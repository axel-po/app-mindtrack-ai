import * as React from "react";
import { JournalEntryWithCompletions } from "@/data/repositories/journal-entries-repository";

type MoodType = "good" | "neutral" | "sad";

const moodConfig: Record<
  MoodType,
  { emoji: string; label: string; color: string }
> = {
  good: { emoji: "😊", label: "Heureux", color: "hsl(142 71% 45%)" },
  neutral: { emoji: "😐", label: "Neutre", color: "hsl(40 84% 58%)" },
  sad: { emoji: "😔", label: "Triste", color: "hsl(343 75% 58%)" },
};

interface ChartDataPoint {
  moodType: MoodType;
  count: number;
  fill: string;
  emoji: string;
  label: string;
  percentage: number;
}

export function useMoodChartData(entries: JournalEntryWithCompletions[]) {
  const [timeRange, setTimeRange] = React.useState("30d");

  // Filter entries based on selected time range
  const filteredEntries = React.useMemo(() => {
    const now = new Date();
    const pastDate = new Date();

    switch (timeRange) {
      case "7d":
        pastDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        pastDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        pastDate.setDate(now.getDate() - 90);
        break;
      default:
        pastDate.setDate(now.getDate() - 30);
    }

    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= pastDate && entryDate <= now;
    });
  }, [entries, timeRange]);

  // Prepare data for the pie chart
  const chartData = React.useMemo(() => {
    // Count mood occurrences
    const moodCounts = filteredEntries.reduce((acc, entry) => {
      const mood = entry.mood as MoodType;
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<MoodType, number>);

    const total = Object.values(moodCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Convert to chart data format
    return Object.entries(moodCounts).map(([moodType, count]) => {
      const mood = moodType as MoodType;
      const config = moodConfig[mood];
      return {
        moodType: mood,
        count,
        fill: config.color,
        emoji: config.emoji,
        label: config.label,
        percentage: Math.round((count / total) * 100),
      };
    }) as ChartDataPoint[];
  }, [filteredEntries]);

  return {
    timeRange,
    setTimeRange,
    chartData,
  };
}
