"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/userinterface/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/userinterface/components/ui/chart";
import { getMoodAnalytics } from "@/userinterface/actions/analytics.actions";
import { MoodAnalytics } from "@/domain/usecases/analytics.usecase";

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
} satisfies ChartConfig;

export function MoodChart() {
  const [chartData, setChartData] = useState<MoodAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMoodAnalytics(6);
        if (result.error) {
          setError(result.error);
        } else {
          setChartData(result.data);
        }
      } catch {
        setError("Failed to load mood analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTrend = () => {
    if (chartData.length < 2) return { trend: "stable", percentage: 0 };

    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];

    const currentGoodRatio =
      current.total > 0 ? (current.good / current.total) * 100 : 0;
    const previousGoodRatio =
      previous.total > 0 ? (previous.good / previous.total) * 100 : 0;

    const difference = currentGoodRatio - previousGoodRatio;

    if (Math.abs(difference) < 5)
      return { trend: "stable", percentage: Math.abs(difference) };
    return {
      trend: difference > 0 ? "up" : "down",
      percentage: Math.abs(difference),
    };
  };

  const trend = calculateTrend();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse d&apos;humeur</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse d&apos;humeur</CardTitle>
          <CardDescription>Erreur lors du chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse d&apos;humeur</CardTitle>
          <CardDescription>Aucune donnée disponible</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Commence à enregistrer ton humeur pour voir tes analyses !
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse d&apos;humeur</CardTitle>
        <CardDescription>
          Évolution de ton humeur sur les 6 derniers mois
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("fr-FR", { month: "short" });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="good"
              type="natural"
              fill="var(--color-good)"
              fillOpacity={0.4}
              stroke="var(--color-good)"
              stackId="mood"
            />
            <Area
              dataKey="neutral"
              type="natural"
              fill="var(--color-neutral)"
              fillOpacity={0.4}
              stroke="var(--color-neutral)"
              stackId="mood"
            />
            <Area
              dataKey="sad"
              type="natural"
              fill="var(--color-sad)"
              fillOpacity={0.4}
              stroke="var(--color-sad)"
              stackId="mood"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {trend.trend === "up" && (
                <>
                  Humeur en amélioration de {trend.percentage.toFixed(1)}% ce
                  mois
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              )}
              {trend.trend === "down" && (
                <>
                  Humeur en baisse de {trend.percentage.toFixed(1)}% ce mois
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              )}
              {trend.trend === "stable" && (
                <>
                  Humeur stable ce mois
                  <Minus className="h-4 w-4 text-gray-500" />
                </>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Basé sur {chartData.reduce((acc, curr) => acc + curr.total, 0)}{" "}
              entrées
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
