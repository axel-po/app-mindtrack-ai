"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { Progress } from "@/userinterface/components/ui/progress";
import { Calendar, BookOpen, Target, TrendingUp } from "lucide-react";

interface ActivityOverviewData {
  totalJournalEntries: number;
  totalHabits: number;
  averageCompletionRate: number;
  entriesThisWeek: number;
  entriesLastWeek: number;
  activeHabits: number;
}

interface ActivityOverviewChartProps {
  data: ActivityOverviewData;
}

export function ActivityOverviewChart({ data }: ActivityOverviewChartProps) {
  const weeklyGrowth = data.entriesLastWeek > 0 
    ? ((data.entriesThisWeek - data.entriesLastWeek) / data.entriesLastWeek) * 100
    : 0;

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return "bg-green-500";
    if (rate >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getActivityLevel = (entries: number) => {
    if (entries >= 7) return { level: "Très actif", color: "text-green-600" };
    if (entries >= 4) return { level: "Actif", color: "text-yellow-600" };
    if (entries >= 1) return { level: "Modéré", color: "text-orange-600" };
    return { level: "Inactif", color: "text-red-600" };
  };

  const activityLevel = getActivityLevel(data.entriesThisWeek);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue d&apos;ensemble de l&apos;activité</CardTitle>
        <CardDescription>
          Résumé de vos activités et performances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{data.totalJournalEntries}</p>
              <p className="text-sm text-muted-foreground">Entrées de journal</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{data.totalHabits}</p>
              <p className="text-sm text-muted-foreground">Habitudes créées</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Taux de completion moyen</span>
            <span className="text-sm text-muted-foreground">
              {data.averageCompletionRate.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={data.averageCompletionRate} 
            className="h-2"
          />
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getCompletionColor(data.averageCompletionRate)}`} />
            <span className="text-xs text-muted-foreground">
              {data.averageCompletionRate >= 80 ? "Excellent" : 
               data.averageCompletionRate >= 50 ? "Bien" : "À améliorer"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Activité cette semaine
            </span>
            <span className={`text-sm font-medium ${activityLevel.color}`}>
              {activityLevel.level}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {data.entriesThisWeek} entrées cette semaine
            </span>
            <span className={`flex items-center gap-1 ${weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-3 w-3" />
              {weeklyGrowth >= 0 ? '+' : ''}{weeklyGrowth.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Habitudes actives</span>
            <span className="text-sm text-muted-foreground">
              {data.activeHabits} / {data.totalHabits}
            </span>
          </div>
          <Progress 
            value={data.totalHabits > 0 ? (data.activeHabits / data.totalHabits) * 100 : 0} 
            className="h-1 mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}