import { useState } from "react";
import { deleteJournalAction } from "@/userinterface/actions/journal.actions";
import { toast } from "sonner";

interface DeleteJournalState {
  isLoading: boolean;
  error: string | null;
}

export function useDeleteJournalViewModel() {
  const [state, setState] = useState<DeleteJournalState>({
    isLoading: false,
    error: null,
  });

  const deleteJournal = async (id: string) => {
    console.log("Deleting journal with ID:", id);
    setState({ isLoading: true, error: null });

    try {
      const result = await deleteJournalAction(id);
      console.log("Delete journal result:", result);

      if (result.success) {
        toast.success("Entrée de journal supprimée avec succès");
        setState({ isLoading: false, error: null });
        return true;
      } else {
        console.error("Error deleting journal:", result.error);
        toast.error(
          result.error || "Erreur lors de la suppression de l'entrée de journal"
        );
        setState({ isLoading: false, error: result.error });
        return false;
      }
    } catch (error) {
      console.error("Exception when deleting journal:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Une erreur est survenue");
      setState({ isLoading: false, error: errorMessage });
      return false;
    }
  };

  return {
    ...state,
    deleteJournal,
  };
}
