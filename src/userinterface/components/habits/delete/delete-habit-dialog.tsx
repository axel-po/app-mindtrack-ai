"use client";

import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import { Button } from "@/userinterface/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/userinterface/components/ui/dialog";
import { useState } from "react";
import { useDeleteHabitViewModel } from "./delete-habit-dialog.viewmodel";

export function DeleteHabitDialog({ habit }: { habit: HabitPresentation }) {
  const [open, setOpen] = useState(false);
  const { deleteHabit, isLoading } = useDeleteHabitViewModel();

  async function handleDelete() {
    const success = await deleteHabit(habit.id);
    if (success) {
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4 text-destructive" />
        <span className="sr-only">Supprimer</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;habitude</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette habitude ? Cette action
              ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 border rounded-md p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xl">
                {habit.emoji || "✨"}
              </div>
              <div>
                <h4 className="font-medium">{habit.name}</h4>
                {habit.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>
          </div>
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
    </>
  );
}
