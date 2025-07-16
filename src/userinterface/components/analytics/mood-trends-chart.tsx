"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/userinterface/components/ui/chart";
import { TrendingUp } from "lucide-react";

interface MoodTrendsData {
  date: string;
  good: number;
  neutral: number;
  sad: number;
}

interface MoodTrendsChartProps {
  data: MoodTrendsData[];
}

const chartConfig = {
  good: {
    label: "Bonne humeur",
    color: "hsl(var(--chart-1))",
  },
  neutral: {
    label: "Neutre", 
    color: "hsl(var(--chart-2))",
  },
  sad: {
    label: "Triste",
    color: "hsl(var(--chart-3))",
  },
};

export function MoodTrendsChart({ data }: MoodTrendsChartProps) {
  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];
  
  const getTrend = () => {
    if (!latestData || !previousData) return null;
    
    const currentGoodRatio = latestData.good / (latestData.good + latestData.neutral + latestData.sad);
    const previousGoodRatio = previousData.good / (previousData.good + previousData.neutral + previousData.sad);
    
    return currentGoodRatio > previousGoodRatio ? "up" : "down";
  };

  const trend = getTrend();
  const totalEntries = data.reduce((sum, item) => sum + item.good + item.neutral + item.sad, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution de l'humeur</CardTitle>
        <CardDescription>
          Tendance de vos humeurs au fil du temps
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="good"
              type="natural"
              fill="var(--color-good)"
              fillOpacity={0.4}
              stroke="var(--color-good)"
              stackId="a"
            />
            <Area
              dataKey="neutral"
              type="natural"
              fill="var(--color-neutral)"
              fillOpacity={0.4}
              stroke="var(--color-neutral)"
              stackId="a"
            />
            <Area
              dataKey="sad"
              type="natural"
              fill="var(--color-sad)"
              fillOpacity={0.4}
              stroke="var(--color-sad)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend === "up" ? "Amélioration de l'humeur" : "Suivi de l'humeur"}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {totalEntries} entrées analysées
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}