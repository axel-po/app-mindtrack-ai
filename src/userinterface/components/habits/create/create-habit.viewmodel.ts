import { useState } from "react";
import {
  createHabitAction,
  updateHabitAction,
} from "@/userinterface/actions/habit.actions";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface CreateHabitState {
  isLoading: boolean;
  error: string | null;
}

export interface HabitFormData {
  name: string;
  description?: string;
  emoji?: string;
}

export function useCreateHabitViewModel() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [state, setState] = useState<CreateHabitState>({
    isLoading: false,
    error: null,
  });

  const createHabit = async (habitData: HabitFormData) => {
    if (!userId) {
      toast.error("Utilisateur non connecté");
      return null;
    }

    setState({ isLoading: true, error: null });

    try {
      const result = await createHabitAction({
        userId,
        name: habitData.name,
        description: habitData.description || null,
        emoji: habitData.emoji || null,
      });

      if (result.data) {
        toast.success("Habitude créée avec succès");
        setState({ isLoading: false, error: null });
        return result.data;
      } else {
        toast.error(result.error || "Erreur lors de la création de l'habitude");
        setState({ isLoading: false, error: result.error });
        return null;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Une erreur est survenue");
      setState({ isLoading: false, error: errorMessage });
      return null;
    }
  };

  const updateHabit = async (id: string, habitData: HabitFormData) => {
    setState({ isLoading: true, error: null });

    try {
      const result = await updateHabitAction(id, habitData);

      if (result.data) {
        toast.success("Habitude mise à jour avec succès");
        setState({ isLoading: false, error: null });
        return result.data;
      } else {
        toast.error(
          result.error || "Erreur lors de la mise à jour de l'habitude"
        );
        setState({ isLoading: false, error: result.error });
        return null;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Une erreur est survenue");
      setState({ isLoading: false, error: errorMessage });
      return null;
    }
  };

  return {
    ...state,
    createHabit,
    updateHabit,
  };
}
