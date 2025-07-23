"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/userinterface/components/ui/chart";
import { Trophy, Target } from "lucide-react";

interface HabitCompletionData {
  habitName: string;
  completionRate: number;
  totalEntries: number;
  completedEntries: number;
}

interface HabitCompletionChartProps {
  data: HabitCompletionData[];
}

const chartConfig = {
  completionRate: {
    label: "Taux de completion",
    color: "hsl(var(--chart-1))",
  },
};

export function HabitCompletionChart({ data }: HabitCompletionChartProps) {
  const avgCompletionRate = data.reduce((sum, item) => sum + item.completionRate, 0) / data.length;
  const bestHabit = data.reduce((prev, current) => 
    prev.completionRate > current.completionRate ? prev : current
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taux de completion des habitudes</CardTitle>
        <CardDescription>
          Performance de vos habitudes sur la période
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="habitName"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return value.length > 12 ? value.substring(0, 12) + "..." : value;
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => [
                    `${value}% (${props.payload.completedEntries}/${props.payload.totalEntries})`,
                    "Taux de completion"
                  ]}
                />
              }
            />
            <Bar
              dataKey="completionRate"
              fill="var(--color-completionRate)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Meilleure habitude: {bestHabit.habitName} ({bestHabit.completionRate.toFixed(1)}%)
              <Trophy className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Taux moyen: {avgCompletionRate.toFixed(1)}%
              <Target className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}