"use client";

import { useState } from "react";
import { JournalEntryEditForm } from "./journal-entry-edit-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconEdit } from "@tabler/icons-react";
import { HabitModel } from "@/types/habit-types";
import { JournalEntryWithCompletions } from "@/data/repositories/journal-entries-repository";

interface JournalEntryEditDialogProps {
  entry: JournalEntryWithCompletions;
  habits: HabitModel[];
  onSuccess?: () => void;
}

export function JournalEntryEditDialog({
  entry,
  habits,
  onSuccess,
}: JournalEntryEditDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <IconEdit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;entrée journalière</DialogTitle>
          <DialogDescription>
            Modifiez votre humeur, vos pensées et vos habitudes pour cette
            entrée
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <JournalEntryEditForm
            className="border-none shadow-none"
            entry={entry}
            habits={habits}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
