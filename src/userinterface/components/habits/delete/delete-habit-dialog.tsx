"use client";

import { HabitModel } from "@/types/habit-types";
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
import { deleteHabit } from "@/app/dashboard/habits/action";
import { toast } from "sonner";

export function DeleteHabitDialog({ habit }: { habit: HabitModel }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    console.log("Deleting habit:", habit.id);
    try {
      setIsDeleting(true);
      const result = await deleteHabit(habit.id);

      if (result.success) {
        toast.success("Habitude supprimée avec succès");
        setOpen(false);
      } else {
        toast.error(
          result.error || "Erreur lors de la suppression de l'habitude"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          console.log("Dialog trigger clicked");
          setOpen(true);
        }}
      >
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
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log("Delete button clicked");
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
