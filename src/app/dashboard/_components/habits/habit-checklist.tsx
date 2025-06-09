"use client";

import * as React from "react";
import { HabitModel } from "@/types/habit-types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface HabitChecklistProps {
  habits: HabitModel[];
  selectedHabits: string[];
  onToggleHabit: (habitId: string, isChecked: boolean) => void;
  className?: string;
}

export function HabitChecklist({
  habits,
  selectedHabits,
  onToggleHabit,
  className,
}: HabitChecklistProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Vos habitudes</h3>
      </div>

      {habits.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas encore créé d&apos;habitudes.
        </p>
      ) : (
        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center space-x-2 rounded-md border p-3"
            >
              <Checkbox
                id={`habit-${habit.id}`}
                checked={selectedHabits.includes(habit.id)}
                onCheckedChange={(checked) => {
                  onToggleHabit(habit.id, !!checked);
                }}
              />
              <Label
                htmlFor={`habit-${habit.id}`}
                className="flex-grow cursor-pointer text-sm"
              >
                {habit.name}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
