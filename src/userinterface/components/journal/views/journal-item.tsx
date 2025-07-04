import React from "react";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import { JournalUpdateDialog } from "../update/journal-update";
import { JournalDeleteDialog } from "../delete/journal-delete";

// Type pour les propriétés du composant
interface JournalItemProps {
  journal: JournalPresentation;
  habits: HabitPresentation[];
  onToggleHabit?: (
    journalId: string,
    habitId: string,
    completed: boolean
  ) => void;
  onEdit?: (journal: JournalPresentation) => void;
  onDelete?: (journalId: string) => void;
  isUpdating?: Record<string, boolean>;
}

// Format date as DD/MM/YYYY
const formatDateFrench = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function JournalItem({
  journal,
  habits,
  onToggleHabit,
  onEdit,
  onDelete,
  isUpdating = {},
}: JournalItemProps) {
  // Determine which habits are completed for this journal
  const completedHabitIds = new Set(journal.habits.map((habit) => habit.id));

  const handleEditSuccess = () => {
    // Appeler le callback onEdit si fourni
    onEdit?.(journal);
  };

  const handleDeleteSuccess = () => {
    // Appeler le callback onDelete si fourni
    onDelete?.(journal.id);
  };

  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="p-3 text-center align-middle">
        <div className="flex items-center justify-center text-xl">
          {journal.moodEmoji}
        </div>
      </td>
      <td className="p-3 text-sm align-middle">
        <div className="max-w-[400px] line-clamp-1">
          {journal.thought || "Aucune réflexion"}
        </div>
      </td>
      <td className="p-3 text-sm text-right whitespace-nowrap text-muted-foreground align-middle">
        {formatDateFrench(journal.date)}
      </td>

      {/* Habits checkboxes */}
      {habits.map((habit) => {
        const isCompleted = completedHabitIds.has(habit.id);
        const updateId = `${journal.id}-${habit.id}`;
        const isLoading = isUpdating[updateId];

        return (
          <td key={habit.id} className="p-3 text-center align-middle">
            <div className="flex items-center justify-center">
              <div
                className={`h-5 w-5 border border-black rounded-sm flex items-center justify-center cursor-pointer transition-all duration-150 ${
                  isCompleted ? "bg-black" : "bg-white hover:bg-gray-100"
                } ${isLoading ? "opacity-50" : ""}`}
                onClick={() =>
                  !isLoading &&
                  onToggleHabit?.(journal.id, habit.id, isCompleted)
                }
                role="checkbox"
                aria-checked={isCompleted}
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === " " || e.key === "Enter") && !isLoading) {
                    e.preventDefault();
                    onToggleHabit?.(journal.id, habit.id, isCompleted);
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

      {/* Actions */}
      <td className="p-3 text-right align-middle">
        <div className="flex items-center justify-end gap-1">
          <JournalUpdateDialog
            entry={journal}
            habits={habits}
            onSuccess={handleEditSuccess}
          />
          <JournalDeleteDialog
            journal={journal}
            onSuccess={handleDeleteSuccess}
          />
        </div>
      </td>
    </tr>
  );
}
