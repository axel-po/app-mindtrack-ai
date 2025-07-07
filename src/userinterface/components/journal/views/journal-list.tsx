"use client";

import React, { useState, useEffect } from "react";
import JournalItem from "./journal-item";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import { toast } from "sonner";
import { useJournalViewModel } from "./journal.viewmodel";
import { SearchIcon } from "lucide-react";
import { Input } from "@/userinterface/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/userinterface/components/ui/pagination";

interface JournalListProps {
  initialJournals?: JournalPresentation[];
  initialHabits?: HabitPresentation[];
  entriesPerPage?: number;
}

export default function JournalList({
  initialJournals,
  initialHabits,
  entriesPerPage = 10,
}: JournalListProps) {
  const { journals, habits, isLoading, error, updateJournal, loadJournals } =
    useJournalViewModel();

  // Local state for updates and search
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [localJournals, setLocalJournals] = useState<JournalPresentation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Use initialJournals and initialHabits if provided, otherwise use from ViewModel
  const displayHabits = initialHabits || habits;

  // Initialize localJournals from initialJournals or journals
  useEffect(() => {
    setLocalJournals(initialJournals || journals);
  }, [initialJournals, journals]);

  // Filter journals based on search term
  const filteredJournals = searchTerm
    ? localJournals.filter(
        (journal) =>
          journal.thought.toLowerCase().includes(searchTerm.toLowerCase()) ||
          journal.date.includes(searchTerm)
      )
    : localJournals;

  // Calculate pagination
  const totalPages = Math.ceil(filteredJournals.length / entriesPerPage);
  const paginatedJournals = filteredJournals.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    console.log("handleDeleteJournal called, reloading journals");
    // Rafraîchir la liste après suppression
    loadJournals();
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  if (localJournals.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium">Aucune entrée de journal trouvée.</p>
        <p className="text-muted-foreground mt-2">
          Commencez par créer votre première entrée de journal.
        </p>
      </div>
    );
  }

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink
          href="#"
          isActive={currentPage === 1}
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate range of visible pages
    const startPage = Math.max(
      2,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

    // Adjust if we're near the beginning
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            href="#"
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative max-w-md mx-auto sm:mx-0">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans vos entrées..."
          className="pl-9 bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b">
              <th className="text-left p-3 text-sm font-medium text-muted-foreground w-8"></th>
              <th className="text-left p-3 text-sm font-medium">
                Entrée du journal
              </th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                Date
              </th>
              {displayHabits.map((habit) => (
                <th key={habit.id} className="p-3 text-center w-16">
                  <span
                    className="text-xs font-medium text-muted-foreground block whitespace-nowrap px-2 tooltip"
                    title={habit.description}
                  >
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
            {paginatedJournals.map((journal) => (
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

      {filteredJournals.length === 0 && searchTerm && (
        <div className="py-10 text-center">
          <p className="text-muted-foreground">
            Aucun résultat trouvé pour &quot;{searchTerm}&quot;
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="text-sm text-muted-foreground">
          Affichage de{" "}
          <span className="font-medium">
            {Math.min(
              (currentPage - 1) * entriesPerPage + 1,
              filteredJournals.length
            )}
            -{Math.min(currentPage * entriesPerPage, filteredJournals.length)}
          </span>{" "}
          sur <span className="font-medium">{filteredJournals.length}</span>{" "}
          entrées
        </div>

        {/* Pagination component */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
