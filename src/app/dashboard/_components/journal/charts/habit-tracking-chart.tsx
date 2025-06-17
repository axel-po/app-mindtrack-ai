"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { HabitModel } from "@/types/habit-types";
import { JournalEntryWithCompletions } from "@/data/repositories/journal-entries-repository";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HabitTrackingChartProps {
  habits: HabitModel[];
  entries: JournalEntryWithCompletions[];
}

export function HabitTrackingChart({
  habits,
  entries,
}: HabitTrackingChartProps) {
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

  // Calculate habit completion data
  const habitCompletionData = React.useMemo(() => {
    // Create a map to track habit completion counts
    const habitCompletionCounts = new Map<string, number>();
    habits.forEach((habit) => habitCompletionCounts.set(habit.id, 0));

    // Count completions for each habit
    filteredEntries.forEach((entry) => {
      entry.completedHabits.forEach((completedHabit) => {
        const currentCount = habitCompletionCounts.get(completedHabit.id) || 0;
        habitCompletionCounts.set(completedHabit.id, currentCount + 1);
      });
    });

    // Convert to chart data format
    return habits.map((habit) => ({
      name: habit.name,
      emoji: habit.emoji || "📌",
      count: habitCompletionCounts.get(habit.id) || 0,
    }));
  }, [habits, filteredEntries]);

  // Chart configuration
  const chartConfig = {
    habits: {
      label: "Habitudes",
    },
    count: {
      label: "Complétions",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suivi des Habitudes</CardTitle>
            <CardDescription>
              Fréquence de complétion de vos habitudes
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {habitCompletionData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              data={habitCompletionData}
              layout="vertical"
              margin={{ left: 80 }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // Limit text length to avoid overflow
                  const maxLength = 15;
                  return value.length > maxLength
                    ? value.substring(0, maxLength) + "..."
                    : value;
                }}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => (
                      <div className="flex items-center gap-1">
                        <span>{props.payload.emoji}</span>
                        <span>{props.payload.name}: </span>
                        <span className="font-medium">{value} fois</span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
