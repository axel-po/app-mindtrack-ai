"use client";

import { useState } from "react";
import { useDeleteJournalViewModel } from "./journal-delete.viewmodel";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
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

  const { deleteJournal, isLoading } = useDeleteJournalViewModel();

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
