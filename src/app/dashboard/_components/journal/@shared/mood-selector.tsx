"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

// Define the MoodType based on schema used in the application
export type MoodType = "good" | "neutral" | "sad";

// Map of mood to emojis and labels
const moodEmojis: Record<MoodType, { emoji: string; label: string }> = {
  good: {
    emoji: "😊",
    label: "Heureux",
  },
  neutral: {
    emoji: "😐",
    label: "Neutre",
  },
  sad: {
    emoji: "😔",
    label: "Triste",
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
    <div className={cn("space-y-2", className)}>
      <p className="text-sm text-muted-foreground text-center">
        Comment vous sentez-vous aujourd&apos;hui ?
      </p>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={handleChange}
        className="flex justify-center gap-2"
      >
        {Object.entries(moodEmojis).map(([key, { emoji, label }]) => (
          <ToggleGroupItem
            key={key}
            value={key}
            aria-label={label}
            className={cn(
              "flex h-16 w-16 flex-col items-center justify-center border rounded-md text-2xl",
              value === key ? "border-primary bg-muted" : "border-border"
            )}
          >
            <span>{emoji}</span>
            <span className="text-[10px] mt-1">{label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
