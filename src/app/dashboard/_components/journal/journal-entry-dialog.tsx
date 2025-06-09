"use client";

import { useState } from "react";

import { JournalEntryForm } from "./journal-entry-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { IconCalendarPlus } from "@tabler/icons-react";
import { HabitModel } from "@/types/habit-types";

export function JournalEntryDialog({ habits }: { habits: HabitModel[] }) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <IconCalendarPlus size={18} />
          <span>Nouvelle entrée</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nouvelle entrée journalière</DialogTitle>
          <DialogDescription>
            Enregistrez votre humeur, vos pensées et vos habitudes pour
            aujourd&apos;hui
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <JournalEntryForm
            className="border-none shadow-none"
            habits={habits}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
