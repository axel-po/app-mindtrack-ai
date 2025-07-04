import { useState, useEffect } from "react";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import {
  getUserHabitsAction,
  createHabitAction,
  updateHabitAction,
  deleteHabitAction,
  toggleHabitCompletionAction,
} from "@/userinterface/actions/habit.actions";
import { useSession } from "@/lib/auth-client";

interface HabitViewModelState {
  habits: HabitPresentation[];
  isLoading: boolean;
  error: string | null;
  completionStatus: Record<string, boolean>;
}

export function useHabitViewModel() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [state, setState] = useState<HabitViewModelState>({
    habits: [],
    isLoading: false,
    error: null,
    completionStatus: {},
  });

  const loadHabits = async () => {
    if (!userId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getUserHabitsAction(userId);

      if (result.data) {
        // Initialize all habits as not completed
        const completionStatus: Record<string, boolean> = {};
        result.data.forEach((habit) => {
          completionStatus[habit.id] = false;
        });

        setState((prev) => ({
          ...prev,
          habits: result.data,
          completionStatus,
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
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  const createHabit = async (habitData: {
    name: string;
    description?: string;
    emoji?: string;
  }) => {
    if (!userId) return null;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await createHabitAction({
        userId,
        name: habitData.name,
        description: habitData.description || null,
        emoji: habitData.emoji || null,
      });

      if (result.data) {
        setState((prev) => ({
          ...prev,
          habits: [...prev.habits, result.data!],
          completionStatus: {
            ...prev.completionStatus,
            [result.data!.id]: false,
          },
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

  const updateHabit = async (
    id: string,
    habitData: {
      name?: string;
      description?: string;
      emoji?: string;
    }
  ) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await updateHabitAction(id, habitData);

      if (result.data) {
        setState((prev) => ({
          ...prev,
          habits: prev.habits.map((habit) =>
            habit.id === id ? result.data! : habit
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

  const deleteHabit = async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await deleteHabitAction(id);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          habits: prev.habits.filter((habit) => habit.id !== id),
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

  const toggleHabitCompletion = async (habitId: string) => {
    if (!userId) return;

    try {
      const result = await toggleHabitCompletionAction(habitId, userId);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          completionStatus: {
            ...prev.completionStatus,
            [habitId]: result.isCompleted,
          },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: result.error,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  // Load habits when user ID changes
  useEffect(() => {
    if (userId) {
      loadHabits();
    }
  }, [userId]);

  return {
    ...state,
    loadHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
  };
}
