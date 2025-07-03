"use client";

import React from "react";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/userinterface/components/ui/card";
import { CheckCircle } from "lucide-react";

interface ChartHeatmapProps {
  habits: HabitPresentation[];
  completionStatus: Record<string, boolean>;
}

export default function ChartHeatmap({
  habits,
  completionStatus,
}: ChartHeatmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi des habitudes</CardTitle>
        <CardDescription>
          Visualisez votre progression pour aujourd&apos;hui
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-lg">
                  {habit.emoji}
                </div>
                <div className="font-medium">{habit.name}</div>
              </div>
              <div className="flex items-center gap-2">
                {completionStatus[habit.id] ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="text-sm text-muted-foreground">
                  {completionStatus[habit.id] ? "Complété" : "À faire"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
