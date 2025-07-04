import { useState } from "react";
import { deleteHabitAction } from "@/userinterface/actions/habit.actions";
import { toast } from "sonner";

interface DeleteHabitState {
  isLoading: boolean;
  error: string | null;
}

export function useDeleteHabitViewModel() {
  const [state, setState] = useState<DeleteHabitState>({
    isLoading: false,
    error: null,
  });

  const deleteHabit = async (id: string) => {
    setState({ isLoading: true, error: null });

    try {
      const result = await deleteHabitAction(id);

      if (result.success) {
        toast.success("Habitude supprimée avec succès");
        setState({ isLoading: false, error: null });
        return true;
      } else {
        toast.error(
          result.error || "Erreur lors de la suppression de l'habitude"
        );
        setState({ isLoading: false, error: result.error });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Une erreur est survenue");
      setState({ isLoading: false, error: errorMessage });
      return false;
    }
  };

  return {
    ...state,
    deleteHabit,
  };
}
