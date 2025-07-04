import { useState } from "react";
import { createJournalAction } from "@/userinterface/actions/journal.actions";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { MoodType } from "@/domain/models/journal.interface";

interface CreateJournalState {
  isLoading: boolean;
  error: string | null;
}

export interface JournalFormData {
  date: string | Date;
  mood: MoodType;
  thought?: string;
  habitIds?: string[];
}

export function useCreateJournalViewModel() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [state, setState] = useState<CreateJournalState>({
    isLoading: false,
    error: null,
  });

  const createJournal = async (journalData: JournalFormData) => {
    if (!userId) {
      toast.error("Utilisateur non connecté");
      return null;
    }

    setState({ isLoading: true, error: null });

    try {
      const result = await createJournalAction({
        userId,
        date:
          journalData.date instanceof Date
            ? journalData.date.toISOString()
            : journalData.date,
        mood: journalData.mood,
        thought: journalData.thought || null,
        habitIds: journalData.habitIds,
      });

      if (result.data) {
        toast.success("Entrée de journal créée avec succès");
        setState({ isLoading: false, error: null });
        return result.data;
      } else {
        toast.error(
          result.error || "Erreur lors de la création de l'entrée de journal"
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
    createJournal,
  };
}
