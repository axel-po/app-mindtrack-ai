import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { getUserStreakAction } from "@/userinterface/actions/streak.actions";
import { toast } from "sonner";

interface StatisticsCardState {
  currentStreak: number;
  highestStreak: number;
  isLoading: boolean;
  error: string | null;
}

export function useStatisticsCardViewModel() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [state, setState] = useState<StatisticsCardState>({
    currentStreak: 0,
    highestStreak: 0,
    isLoading: false,
    error: null,
  });

  const loadStreakData = useCallback(async () => {
    if (!userId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getUserStreakAction(userId);

      setState((prev) => ({
        ...prev,
        currentStreak: result.currentStreak,
        highestStreak: result.highestStreak,
        isLoading: false,
        error: result.error,
      }));

      if (result.error) {
        toast.error(
          `Erreur lors du chargement des statistiques: ${result.error}`
        );
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
      toast.error(
        `Erreur inattendue: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [userId]);

  // Load data when user ID changes
  useEffect(() => {
    if (userId) {
      loadStreakData();
    }
  }, [userId, loadStreakData]);

  return {
    ...state,
    loadStreakData,
    isAuthenticated: !!userId,
  };
}
