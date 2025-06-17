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

  // Calculate daily habit completion data
  const dailyHabitData = React.useMemo(() => {
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

    // Create array of all days in range
    const days = [];
    const currentDate = new Date(pastDate);

    while (currentDate <= now) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Map each day to completion data
    return days.map((day) => {
      const dayString = day.toISOString().split("T")[0];
      const dayEntries = filteredEntries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate.toISOString().split("T")[0] === dayString;
      });

      // Count total completions for this day
      const totalCompletions = dayEntries.reduce(
        (sum, entry) => sum + entry.completedHabits.length,
        0
      );

      // Calculate completion rate (percentage of habits completed)
      const completionRate =
        habits.length > 0
          ? Math.round((totalCompletions / habits.length) * 100)
          : 0;

      return {
        date: dayString,
        day: day.getDate(),
        month: day.toLocaleDateString("fr-FR", { month: "short" }),
        totalCompletions,
        completionRate,
        formattedDate: day.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        }),
      };
    });
  }, [habits, filteredEntries, timeRange]);

  // Chart configuration
  const chartConfig = {
    totalCompletions: {
      label: "Complétions totales",
      color: "hsl(var(--primary))",
    },
    completionRate: {
      label: "Taux de complétion (%)",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suivi des Habitudes</CardTitle>
            <CardDescription>
              Évolution quotidienne de vos habitudes
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
        {dailyHabitData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              data={dailyHabitData}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              chartConfig[name as keyof typeof chartConfig]
                                ?.color,
                          }}
                        />
                        <span className="font-medium">
                          {chartConfig[name as keyof typeof chartConfig]?.label}
                          : {value}
                          {name === "completionRate" ? "%" : ""}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="totalCompletions"
                fill="var(--color-totalCompletions)"
                radius={[4, 4, 0, 0]}
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
