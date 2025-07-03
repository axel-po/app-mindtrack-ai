import { useState, useEffect } from "react";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import {
  getJournalsByUserIdAction,
  getJournalByIdAction,
  createJournalAction,
  updateJournalAction,
  deleteJournalAction,
} from "@/userinterface/actions/journal.actions";
import { getUserHabitsAction } from "@/userinterface/actions/habit.actions";
import { useSession } from "@/lib/auth-client";

// Type for mood from the database schema
type MoodType = "good" | "neutral" | "sad";

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

  // Helper function to convert numeric mood to enum value
  const convertMoodToEnum = (moodValue: number): MoodType => {
    if (moodValue >= 8) return "good";
    if (moodValue >= 4) return "neutral";
    return "sad";
  };

  const createJournal = async (journalData: {
    date: string | Date;
    mood: number;
    thought?: string;
    habitIds?: string[];
  }) => {
    if (!userId) return null;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await createJournalAction({
        userId,
        date:
          journalData.date instanceof Date
            ? journalData.date.toISOString()
            : journalData.date,
        mood: convertMoodToEnum(journalData.mood),
        thought: journalData.thought || null,
        habitIds: journalData.habitIds,
      });

      if (result.data) {
        setState((prev) => ({
          ...prev,
          journals: [result.data!, ...prev.journals],
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

  const updateJournal = async (
    id: string,
    journalData: {
      date?: string | Date;
      mood?: number;
      thought?: string;
      habitIds?: string[];
    }
  ) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Convert Date object to string if needed and mood number to enum
      const formattedData = {
        ...journalData,
        date:
          journalData.date instanceof Date
            ? journalData.date.toISOString()
            : journalData.date,
        mood:
          journalData.mood !== undefined
            ? convertMoodToEnum(journalData.mood)
            : undefined,
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

  const deleteJournal = async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await deleteJournalAction(id);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          journals: prev.journals.filter((journal) => journal.id !== id),
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

      return result.success;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
      return false;
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
    createJournal,
    updateJournal,
    deleteJournal,
  };
}

export function useJournalDetailViewModel(journalId: string | null) {
  const [journal, setJournal] = useState<JournalPresentation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJournal = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getJournalByIdAction(id);

      if (result.data) {
        setJournal(result.data);
      } else {
        setError(result.error || "Journal not found");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (journalId) {
      loadJournal(journalId);
    }
  }, [journalId]);

  return {
    journal,
    isLoading,
    error,
    loadJournal,
  };
}
