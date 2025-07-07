"use client";

import { useState, useEffect } from "react";
import { useDeleteJournalViewModel } from "./journal-delete.viewmodel";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { IconTrash, IconFlame, IconAlertTriangle } from "@tabler/icons-react";

import { Button } from "@/userinterface/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/userinterface/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/userinterface/components/ui/alert";
import { getUserStreakAction } from "@/userinterface/actions/streak.actions";
import { useSession } from "@/lib/auth-client";

interface JournalDeleteDialogProps {
  journal: JournalPresentation;
  onSuccess?: () => void;
}

export function JournalDeleteDialog({
  journal,
  onSuccess,
}: JournalDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoadingStreak, setIsLoadingStreak] = useState(false);
  const [willLoseStreak, setWillLoseStreak] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const { deleteJournal, isLoading } = useDeleteJournalViewModel();

  // Vérifier si la suppression de cette entrée affectera le streak
  useEffect(() => {
    if (open && userId) {
      setIsLoadingStreak(true);
      getUserStreakAction(userId).then((result) => {
        setCurrentStreak(result.currentStreak);

        // Vérifier si l'entrée à supprimer fait partie du streak actuel
        const entryDate = new Date(journal.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const entryDateNormalized = new Date(entryDate);
        entryDateNormalized.setHours(0, 0, 0, 0);

        // Si l'entrée est d'aujourd'hui ou dans les X derniers jours (où X est le streak actuel)
        const isPartOfStreak =
          entryDateNormalized >= yesterday ||
          (result.currentStreak > 0 &&
            entryDateNormalized >=
              new Date(today.setDate(today.getDate() - result.currentStreak)));

        setWillLoseStreak(result.currentStreak > 0 && isPartOfStreak);
        setIsLoadingStreak(false);
      });
    }
  }, [open, userId, journal.date]);

  const handleDelete = async () => {
    const success = await deleteJournal(journal.id);

    if (success) {
      setOpen(false);
      onSuccess?.();
    }
  };

  const formattedDate = format(new Date(journal.date), "d MMMM yyyy", {
    locale: fr,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
        >
          <IconTrash size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;entrée journalière</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;entrée du {formattedDate}{" "}
            ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        {isLoadingStreak ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : willLoseStreak && currentStreak > 0 ? (
          <Alert variant="destructive" className="mt-4">
            <IconAlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              Attention à votre série de flammes!
            </AlertTitle>
            <AlertDescription className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <IconFlame className="text-orange-500" /> Vous avez actuellement
                une série de <strong>{currentStreak} jours</strong> consécutifs.
              </div>
              <p>
                Si vous supprimez cette entrée, vous perdrez votre série
                actuelle de flammes.
              </p>
            </AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
