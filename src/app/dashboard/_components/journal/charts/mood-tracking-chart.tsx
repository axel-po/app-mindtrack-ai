"use client";

import * as React from "react";
import { PieChart, Pie, Cell, LabelList } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMoodChartData } from "@/hooks/use-mood-chart-data";

interface MoodTrackingChartProps {
  entries: JournalEntryWithCompletions[];
}

// Chart configuration
const chartConfig = {
  count: {
    label: "Entrées",
  },
  good: {
    label: "Heureux",
    color: "hsl(142 71% 45%)",
  },
  neutral: {
    label: "Neutre",
    color: "hsl(40 84% 58%)",
  },
  sad: {
    label: "Triste",
    color: "hsl(343 75% 58%)",
  },
} satisfies ChartConfig;

export function MoodTrackingChart({ entries }: MoodTrackingChartProps) {
  const { timeRange, setTimeRange, chartData } = useMoodChartData(entries);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Distribution de l&apos;Humeur</CardTitle>
            <CardDescription>
              Répartition de vos humeurs sur la période
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
      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="moodType"
                strokeWidth={5}
              >
                <LabelList
                  className="fill-background"
                  stroke="none"
                  fontSize={20}
                  formatter={(
                    value: unknown,
                    entry: unknown,
                    index: number
                  ) => {
                    const dataPoint = chartData[index];
                    return dataPoint?.emoji;
                  }}
                />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        )}
        {chartData.length > 0 && (
          <div className="mt-4 flex justify-center gap-4">
            {chartData.map((item) => (
              <div key={item.moodType} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">
                  {item.emoji} {item.label} ({item.count})
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
