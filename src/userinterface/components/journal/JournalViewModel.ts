import { useState, useEffect } from "react";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import {
  getJournalsByUserIdAction,
  updateJournalAction,
} from "@/userinterface/actions/journal.actions";
import { getUserHabitsAction } from "@/userinterface/actions/habit.actions";
import { useSession } from "@/lib/auth-client";
import { MoodType } from "@/domain/models/journal.interface";

interface JournalViewModelState {
  journals: JournalPresentation[];
  habits: HabitPresentation[];
  isLoading: boolean;
  error: string | null;
}

export function useJournalViewModel() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [state, setState] = useState<JournalViewModelState>({
    journals: [],
    habits: [],
    isLoading: false,
    error: null,
  });

  const loadJournals = async () => {
    if (!userId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getJournalsByUserIdAction(userId);

      setState((prev) => ({
        ...prev,
        journals: result.data,
        isLoading: false,
        error: result.error,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  const loadHabits = async () => {
    if (!userId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getUserHabitsAction(userId);

      setState((prev) => ({
        ...prev,
        habits: result.data,
        isLoading: false,
        error: result.error,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  const updateJournal = async (
    id: string,
    journalData: {
      date?: string | Date;
      mood?: MoodType;
      thought?: string;
      habitIds?: string[];
    }
  ) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Convert Date object to string if needed
      const formattedData = {
        ...journalData,
        date:
          journalData.date instanceof Date
            ? journalData.date.toISOString()
            : journalData.date,
      };

      const result = await updateJournalAction(id, formattedData);

      if (result.data) {
        setState((prev) => ({
          ...prev,
          journals: prev.journals.map((journal) =>
            journal.id === id ? result.data! : journal
          ),
          isLoading: false,
          error: result.error,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error,
        }));
      }

      return result.data;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
      return null;
    }
  };

  // Load data when user ID changes
  useEffect(() => {
    if (userId) {
      loadJournals();
      loadHabits();
    }
  }, [userId]);

  return {
    ...state,
    loadJournals,
    loadHabits,
    updateJournal,
  };
}
