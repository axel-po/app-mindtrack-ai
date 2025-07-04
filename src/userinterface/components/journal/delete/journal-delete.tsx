"use client";

import { useState } from "react";
import { useJournalViewModel } from "../JournalViewModel";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { IconTrash } from "@tabler/icons-react";

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

interface JournalDeleteDialogProps {
  journal: JournalPresentation;
  onSuccess?: () => void;
}

export function JournalDeleteDialog({
  journal,
  onSuccess,
}: JournalDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteJournal } = useJournalViewModel();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const success = await deleteJournal(journal.id);

      if (success) {
        toast.success("Entrée de journal supprimée avec succès");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error("Erreur lors de la suppression de l'entrée de journal");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsDeleting(false);
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
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
