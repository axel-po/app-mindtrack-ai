"use client";

import * as React from "react";
import { JournalEntryWithCompletions } from "@/data/repositories/journal-entries-repository";
import { HabitModel } from "@/types/habit-types";
import { toggleHabitCompletion } from "@/app/dashboard/journal/action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JournalEntryEditDialog } from "../edit/journal-entry-edit-dialog";
import { JournalEntryDeleteDialog } from "../delete/journal-entry-delete-dialog";

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
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const entriesPerPage = 10;

  React.useEffect(() => {
    setLocalEntries(entries);
    setCurrentPage(1); // Reset to first page when entries change
  }, [entries]);

  // Calculate pagination
  const totalPages = Math.ceil(localEntries.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = localEntries.slice(startIndex, endIndex);

  const handleToggleHabit = async (
    journalEntryId: string,
    habitId: string,
    isCurrentlyCompleted: boolean
  ) => {
    const updateId = `${journalEntryId}-${habitId}`;

    if (onToggleHabit) {
      onToggleHabit(journalEntryId, habitId, !isCurrentlyCompleted);
    } else {
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

  const handleEntryUpdated = () => {
    // Reload entries from parent
    setLocalEntries(entries);
  };

  if (!localEntries.length) {
    return null;
  }

  return (
    <div className="space-y-4">
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
              <th className="p-3 text-right w-24">
                <span className="text-xs font-medium text-muted-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((entry, index) => (
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
                              strokeWidth="2"
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
                <td className="p-3 text-right align-middle">
                  <div className="flex items-center justify-end gap-1">
                    <JournalEntryEditDialog
                      entry={entry}
                      habits={habits}
                      onSuccess={handleEntryUpdated}
                    />
                    <JournalEntryDeleteDialog
                      entryId={entry.id}
                      entryDate={entry.date}
                      onSuccess={handleEntryUpdated}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Affichage de {startIndex + 1} à{" "}
            {Math.min(endIndex, localEntries.length)} sur {localEntries.length}{" "}
            entrées
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
