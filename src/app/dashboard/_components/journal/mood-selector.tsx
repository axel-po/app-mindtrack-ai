"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

// Define the MoodType based on schema used in the application
export type MoodType = "happy" | "neutral" | "sad";

// Map of mood to emojis, labels and colors
const moodEmojis: Record<
  MoodType,
  { emoji: string; label: string; color: string }
> = {
  happy: {
    emoji: "😊",
    label: "Heureux",
    color: "bg-green-100 dark:bg-green-900/20",
  },
  neutral: {
    emoji: "😐",
    label: "Neutre",
    color: "bg-blue-100 dark:bg-blue-900/20",
  },
  sad: {
    emoji: "😔",
    label: "Triste",
    color: "bg-red-100 dark:bg-red-900/20",
  },
};

interface MoodSelectorProps {
  value?: MoodType;
  onValueChange: (value: MoodType) => void;
  className?: string;
}

export function MoodSelector({
  value,
  onValueChange,
  className,
}: MoodSelectorProps) {
  const handleChange = (newValue: string) => {
    if (newValue as MoodType) {
      onValueChange(newValue as MoodType);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-base font-medium text-center mb-2">
        Comment vous sentez-vous aujourd&apos;hui ?
      </p>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={handleChange}
        className="flex justify-center gap-4"
      >
        {Object.entries(moodEmojis).map(([key, { emoji, label, color }]) => (
          <ToggleGroupItem
            key={key}
            value={key}
            aria-label={label}
            className={cn(
              "flex h-24 w-24 flex-col items-center justify-center rounded-full text-4xl transition-all duration-200 hover:scale-105",
              color,
              value === key ? "ring-2 ring-primary shadow-md scale-105" : ""
            )}
          >
            <span className="mb-2">{emoji}</span>
            <span className="text-xs font-medium">{label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
