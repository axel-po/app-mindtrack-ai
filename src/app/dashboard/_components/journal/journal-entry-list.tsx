"use client";

import * as React from "react";
import { JournalEntryWithCompletions } from "@/data/repositories/journal-entries-repository";
import { HabitModel } from "@/types/habit-types";
import { toggleHabitCompletion } from "@/app/dashboard/journal/action";
import { toast } from "sonner";

interface JournalEntryListProps {
  entries: JournalEntryWithCompletions[];
  habits?: HabitModel[];
  onToggleHabit?: (
    journalEntryId: string,
    habitId: string,
    completed: boolean
  ) => void;
}

const moodEmojis = {
  good: "😊",
  neutral: "😐",
  sad: "😔",
};

const formatDateFrench = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export function JournalEntryList({
  entries,
  habits = [],
  onToggleHabit,
}: JournalEntryListProps) {
  const [localEntries, setLocalEntries] = React.useState(entries);
  const [isUpdating, setIsUpdating] = React.useState<{
    [key: string]: boolean;
  }>({});

  React.useEffect(() => {
    setLocalEntries(entries);
  }, [entries]);

  const handleToggleHabit = async (
    journalEntryId: string,
    habitId: string,
    isCurrentlyCompleted: boolean
  ) => {
    if (onToggleHabit) {
      onToggleHabit(journalEntryId, habitId, !isCurrentlyCompleted);
    } else {
      const updateId = `${journalEntryId}-${habitId}`;
      setIsUpdating((prev) => ({ ...prev, [updateId]: true }));

      try {
        setLocalEntries((prev) =>
          prev.map((entry) => {
            if (entry.id === journalEntryId) {
              const updatedCompletedHabits = isCurrentlyCompleted
                ? entry.completedHabits.filter((habit) => habit.id !== habitId)
                : [
                    ...entry.completedHabits,
                    {
                      id: habitId,
                      name:
                        habits.find((h) => h.id === habitId)?.name ||
                        "Habitude",
                    },
                  ];

              return {
                ...entry,
                completedHabits: updatedCompletedHabits,
              };
            }
            return entry;
          })
        );

        const result = await toggleHabitCompletion(
          journalEntryId,
          habitId,
          !isCurrentlyCompleted
        );

        if (!result.success) {
          throw new Error(result.error || "Erreur lors de la mise à jour");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la mise à jour de l'habitude");

        setLocalEntries(entries);
      } finally {
        setIsUpdating((prev) => ({ ...prev, [updateId]: false }));
      }
    }
  };

  if (!localEntries.length) {
    return null;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-muted/20 border-b">
              <th className="text-left p-3 text-sm font-medium text-muted-foreground w-8"></th>
              <th className="text-left p-3 text-sm font-medium">
                Entrée du journal
              </th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                Date
              </th>
              {habits.map((habit) => (
                <th key={habit.id} className="p-3 text-center w-16">
                  <span className="text-xs font-medium text-muted-foreground block whitespace-nowrap px-2">
                    {habit.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {localEntries.map((entry, index) => (
              <tr
                key={entry.id}
                className={`hover:bg-muted/20 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-muted/5"
                }`}
              >
                <td className="p-3 text-center align-middle">
                  <div className="flex items-center justify-center text-xl">
                    {moodEmojis[entry.mood]}
                  </div>
                </td>
                <td className="p-3 text-sm align-middle">
                  <div className="max-w-[400px] line-clamp-1">
                    {entry.thought || "Aucune réflexion"}
                  </div>
                </td>
                <td className="p-3 text-sm text-right whitespace-nowrap text-muted-foreground align-middle">
                  {formatDateFrench(new Date(entry.date))}
                </td>
                {habits.map((habit) => {
                  const isCompleted = entry.completedHabits.some(
                    (completedHabit) => completedHabit.id === habit.id
                  );
                  const updateId = `${entry.id}-${habit.id}`;
                  const isLoading = isUpdating[updateId];

                  return (
                    <td key={habit.id} className="p-3 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <div
                          className={`h-5 w-5 border border-black rounded-sm flex items-center justify-center cursor-pointer transition-all duration-150 ${
                            isCompleted
                              ? "bg-black"
                              : "bg-white hover:bg-gray-100"
                          } ${isLoading ? "opacity-50" : ""}`}
                          onClick={() =>
                            !isLoading &&
                            handleToggleHabit(entry.id, habit.id, isCompleted)
                          }
                          role="checkbox"
                          aria-checked={isCompleted}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (
                              (e.key === " " || e.key === "Enter") &&
                              !isLoading
                            ) {
                              e.preventDefault();
                              handleToggleHabit(
                                entry.id,
                                habit.id,
                                isCompleted
                              );
                            }
                          }}
                        >
                          {isCompleted && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3 w-3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
