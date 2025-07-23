"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/userinterface/components/ui/chart";
import { Flame, Calendar } from "lucide-react";

interface HabitStreakData {
  date: string;
  currentStreak: number;
  highestStreak: number;
}

interface HabitStreakChartProps {
  data: HabitStreakData[];
  currentStreak: number;
  highestStreak: number;
}

const chartConfig = {
  currentStreak: {
    label: "Série actuelle",
    color: "hsl(var(--chart-1))",
  },
  highestStreak: {
    label: "Meilleure série",
    color: "hsl(var(--chart-2))",
  },
};

export function HabitStreakChart({ data, currentStreak, highestStreak }: HabitStreakChartProps) {
  const isStreakGrowing = data.length >= 2 && 
    data[data.length - 1].currentStreak > data[data.length - 2].currentStreak;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des séries</CardTitle>
        <CardDescription>
          Suivi de vos séries d'habitudes au fil du temps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('fr-FR', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="highestStreak"
              type="natural"
              fill={chartConfig.highestStreak.color}
              fillOpacity={0.4}
              stroke={chartConfig.highestStreak.color}
              stackId="a"
            />
            <Area
              dataKey="currentStreak"
              type="natural"
              fill={chartConfig.currentStreak.color}
              fillOpacity={0.4}
              stroke={chartConfig.currentStreak.color}
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isStreakGrowing ? (
                <>
                  Série en progression! <Flame className="h-4 w-4" />
                </>
              ) : (
                <>
                  Série actuelle: {currentStreak} jours <Calendar className="h-4 w-4" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Record personnel: {highestStreak} jours
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}