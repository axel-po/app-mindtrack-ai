"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
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

interface MoodTrackingChartProps {
  entries: JournalEntryWithCompletions[];
}

type MoodType = "good" | "neutral" | "sad";

// Map mood values to numeric values for the chart
const moodValueMap: Record<MoodType, number> = {
  good: 3,
  neutral: 2,
  sad: 1,
};

// Map mood values to emojis and labels
const moodEmojis: Record<MoodType, { emoji: string; label: string }> = {
  good: { emoji: "😊", label: "Heureux" },
  neutral: { emoji: "😐", label: "Neutre" },
  sad: { emoji: "😔", label: "Triste" },
};

interface ChartDataPoint {
  date: string;
  formattedDate: string;
  mood: number;
  moodType: MoodType;
  thought: string | null;
}

export function MoodTrackingChart({ entries }: MoodTrackingChartProps) {
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

  // Prepare data for the chart
  const moodData = React.useMemo(() => {
    // Sort entries by date
    const sortedEntries = [...filteredEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Convert to chart data format
    return sortedEntries.map((entry) => {
      const date = new Date(entry.date);
      return {
        date: entry.date,
        formattedDate: date.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        }),
        mood: moodValueMap[entry.mood as MoodType],
        moodType: entry.mood as MoodType,
        thought: entry.thought,
      };
    }) as ChartDataPoint[];
  }, [filteredEntries]);

  // Chart configuration
  const chartConfig = {
    mood: {
      label: "Humeur",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  // Custom tick formatter for Y axis to show mood labels
  const formatYAxis = (value: number) => {
    switch (value) {
      case 3:
        return "😜";
      case 2:
        return "😐";
      case 1:
        return "😔";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suivi de l&apos;Humeur</CardTitle>
            <CardDescription>
              Évolution de votre humeur au fil du temps
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
        {moodData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              data={moodData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={20}
              />
              <YAxis
                domain={[0.5, 3.5]}
                ticks={[1, 2, 3]}
                tickFormatter={formatYAxis}
                tick={{ fontSize: 16 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const payload = props.payload as ChartDataPoint;
                      const moodType = payload.moodType;
                      const emoji = moodEmojis[moodType].emoji;
                      const label = moodEmojis[moodType].label;
                      const thought = payload.thought;

                      return (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{emoji}</span>
                            <span className="font-medium">{label}</span>
                          </div>
                          {thought && (
                            <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                              &ldquo;{thought}&rdquo;
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="var(--color-mood)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
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
