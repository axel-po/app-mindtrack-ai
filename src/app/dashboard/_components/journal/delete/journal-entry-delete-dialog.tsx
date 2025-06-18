"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { deleteJournalEntry } from "@/app/dashboard/journal/action";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface JournalEntryDeleteDialogProps {
  entryId: string;
  entryDate: string;
  onSuccess?: () => void;
}

export function JournalEntryDeleteDialog({
  entryId,
  entryDate,
  onSuccess,
}: JournalEntryDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteJournalEntry(entryId);

      if (result.success) {
        toast.success("Entrée de journal supprimée avec succès");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(
          result.error || "Erreur lors de la suppression de l'entrée de journal"
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = format(new Date(entryDate), "d MMMM yyyy", {
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
