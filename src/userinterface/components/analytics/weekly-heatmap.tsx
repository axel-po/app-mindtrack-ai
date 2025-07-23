"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, Activity } from "lucide-react";

interface WeeklyHeatmapData {
  date: string;
  value: number;
  activities: number;
}

interface WeeklyHeatmapProps {
  data: WeeklyHeatmapData[];
  title?: string;
  description?: string;
}

export function WeeklyHeatmap({ 
  data, 
  title = "Heatmap d'activité",
  description = "Visualisation de votre activité quotidienne"
}: WeeklyHeatmapProps) {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  const getIntensityClass = (value: number) => {
    if (value === 0) return "bg-muted";
    if (value <= 1) return "bg-green-100 dark:bg-green-900";
    if (value <= 2) return "bg-green-200 dark:bg-green-800";
    if (value <= 3) return "bg-green-300 dark:bg-green-700";
    if (value <= 4) return "bg-green-400 dark:bg-green-600";
    return "bg-green-500 dark:bg-green-500";
  };

  const getTooltipText = (item: WeeklyHeatmapData) => {
    const date = new Date(item.date);
    const dayName = days[date.getDay()];
    const dateStr = date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
    return `${dayName} ${dateStr}: ${item.activities} activités`;
  };

  // Group data by weeks
  const weeks: WeeklyHeatmapData[][] = [];
  let currentWeek: WeeklyHeatmapData[] = [];
  
  data.forEach((item, index) => {
    const date = new Date(item.date);
    const dayOfWeek = date.getDay();
    
    if (index === 0) {
      // Fill in empty days at the beginning of the first week
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({
          date: '',
          value: 0,
          activities: 0
        });
      }
    }
    
    currentWeek.push(item);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Add remaining days to the last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: '',
        value: 0,
        activities: 0
      });
    }
    weeks.push(currentWeek);
  }

  const totalActivities = data.reduce((sum, d) => sum + d.activities, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {/* Days header */}
          <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground">
            {days.map((day) => (
              <div key={day} className="text-center p-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => (
                  <div key={dayIndex} className="relative group">
                    <div
                      className={cn(
                        "w-full h-8 rounded-sm border border-border/50 transition-all hover:border-border",
                        getIntensityClass(day.value),
                        day.date ? "cursor-pointer" : "opacity-30"
                      )}
                      title={day.date ? getTooltipText(day) : ''}
                    />
                    {day.date && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-foreground/80">
                          {day.activities > 0 ? day.activities : ''}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Moins</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "w-3 h-3 rounded-sm",
                    getIntensityClass(level)
                  )}
                />
              ))}
            </div>
            <span>Plus</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">
              {totalActivities} activités totales
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Période de {data.length} jours
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}