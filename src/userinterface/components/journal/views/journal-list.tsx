import React, { useState, useEffect } from "react";
import JournalItem from "./journal-item";
import JournalPagination from "./journal-pagination";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import { toast } from "sonner";
import { useJournalViewModel } from "./journal.viewmodel";

interface JournalListProps {
  initialJournals?: JournalPresentation[];
  initialHabits?: HabitPresentation[];
}

export default function JournalList({
  initialJournals,
  initialHabits,
}: JournalListProps) {
  const { journals, habits, isLoading, error, updateJournal, loadJournals } =
    useJournalViewModel();

  // Local state for pagination and updates
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [localJournals, setLocalJournals] = useState<JournalPresentation[]>([]);
  const entriesPerPage = 10;

  // Use initialJournals and initialHabits if provided, otherwise use from ViewModel
  const displayHabits = initialHabits || habits;

  // Initialize localJournals from initialJournals or journals
  useEffect(() => {
    setLocalJournals(initialJournals || journals);
  }, [initialJournals, journals]);

  // Calculate pagination
  const totalPages = Math.ceil(localJournals.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = localJournals.slice(startIndex, endIndex);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle habit toggle
  const handleToggleHabit = async (
    journalId: string,
    habitId: string,
    isCurrentlyCompleted: boolean
  ) => {
    const updateId = `${journalId}-${habitId}`;
    setIsUpdating((prev) => ({ ...prev, [updateId]: true }));

    try {
      // Optimistically update the UI first
      setLocalJournals((prev) =>
        prev.map((journal) => {
          if (journal.id === journalId) {
            let updatedHabits: HabitPresentation[];

            if (isCurrentlyCompleted) {
              // Remove habit
              updatedHabits = journal.habits.filter((h) => h.id !== habitId);
            } else {
              // Add habit - find the habit from displayHabits
              const habitToAdd = displayHabits.find((h) => h.id === habitId);
              if (!habitToAdd) {
                return journal;
              }
              updatedHabits = [...journal.habits, habitToAdd];
            }

            return {
              ...journal,
              habits: updatedHabits,
            };
          }
          return journal;
        })
      );

      // Get current journal
      const journal = localJournals.find((j) => j.id === journalId);
      if (!journal) return;

      // Update habits
      const currentHabitIds = journal.habits.map((h) => h.id);
      let newHabitIds: string[];

      if (isCurrentlyCompleted) {
        // Remove habit
        newHabitIds = currentHabitIds.filter((id) => id !== habitId);
      } else {
        // Add habit
        newHabitIds = [...currentHabitIds, habitId];
      }

      // Update journal with new habits
      const result = await updateJournal(journalId, { habitIds: newHabitIds });

      if (!result) {
        throw new Error("Failed to update journal");
      }
    } catch (error) {
      console.error("Failed to toggle habit:", error);
      toast.error("Erreur lors de la mise à jour de l'habitude");

      // Revert the optimistic update
      setLocalJournals(initialJournals || journals);
    } finally {
      setIsUpdating((prev) => ({ ...prev, [updateId]: false }));
    }
  };

  // Handle edit journal - called after successful edit via dialog
  const handleEditJournal = () => {
    // Rafraîchir la liste après modification
    loadJournals();
  };

  // Handle delete journal - called after successful delete via dialog
  const handleDeleteJournal = () => {
    // Rafraîchir la liste après suppression
    loadJournals();
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="py-10 text-center">Chargement des données...</div>;
  }

  if (localJournals.length === 0) {
    return (
      <div className="py-10 text-center">Aucune entrée de journal trouvée.</div>
    );
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
              {displayHabits.map((habit) => (
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
            {currentEntries.map((journal) => (
              <JournalItem
                key={journal.id}
                journal={journal}
                habits={displayHabits}
                onToggleHabit={handleToggleHabit}
                onEdit={handleEditJournal}
                onDelete={handleDeleteJournal}
                isUpdating={isUpdating}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <JournalPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={localJournals.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
