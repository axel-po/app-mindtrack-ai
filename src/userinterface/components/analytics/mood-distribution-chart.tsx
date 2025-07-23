"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/userinterface/components/ui/chart";
import { TrendingUp } from "lucide-react";

interface MoodDistributionData {
  mood: string;
  count: number;
  percentage: number;
}

interface MoodDistributionChartProps {
  data: MoodDistributionData[];
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

export function MoodDistributionChart({ data }: MoodDistributionChartProps) {
  const totalEntries = data.reduce((sum, item) => sum + item.count, 0);
  const predominantMood = data.reduce((prev, current) => 
    prev.count > current.count ? prev : current
  );

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "good":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😔";
      default:
        return "😐";
    }
  };

  const chartData = data.map(item => ({
    ...item,
    fill: `var(--color-${item.mood})`,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribution de l'humeur</CardTitle>
        <CardDescription>Répartition de vos humeurs sur la période</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="mood"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Humeur dominante: {getMoodEmoji(predominantMood.mood)} {chartConfig[predominantMood.mood as keyof typeof chartConfig]?.label}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {predominantMood.percentage.toFixed(1)}% sur {totalEntries} entrées
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}