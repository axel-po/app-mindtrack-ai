"use client";

import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import { Button } from "@/userinterface/components/ui/button";
import { PlusCircle, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/userinterface/components/ui/dialog";
import { Input } from "@/userinterface/components/ui/input";
import { Textarea } from "@/userinterface/components/ui/textarea";
import { useState } from "react";
import { EmojiPicker } from "./emoji-picker";
import { useHabitViewModel } from "../HabitViewModel";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/userinterface/components/ui/form";

const habitSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  emoji: z.string().min(1, "L'emoji est requis"),
});

type HabitFormValues = z.infer<typeof habitSchema>;

export function HabitDialog({
  mode,
  habit,
}: {
  mode: "create" | "edit";
  habit?: HabitPresentation;
}) {
  const [open, setOpen] = useState(false);
  const { createHabit, updateHabit } = useHabitViewModel();

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name || "",
      description: habit?.description || "",
      emoji: habit?.emoji || "✨",
    },
  });

  async function onSubmit(values: HabitFormValues) {
    try {
      if (mode === "create") {
        const result = await createHabit({
          name: values.name,
          description: values.description,
          emoji: values.emoji,
        });

        if (result) {
          toast.success("Habitude créée avec succès");
          setOpen(false);
          form.reset();
        } else {
          toast.error("Erreur lors de la création de l'habitude");
        }
      } else if (habit) {
        const result = await updateHabit(habit.id, {
          name: values.name,
          description: values.description,
          emoji: values.emoji,
        });

        if (result) {
          toast.success("Habitude mise à jour avec succès");
          setOpen(false);
        } else {
          toast.error("Erreur lors de la mise à jour de l'habitude");
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle habitude
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Modifier</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer une habitude" : "Modifier l'habitude"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ajoutez une nouvelle habitude à suivre"
              : "Modifiez les détails de votre habitude"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="flex items-start gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Emoji</label>
                <FormField
                  control={form.control}
                  name="emoji"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <EmojiPicker
                          defaultEmoji={field.value}
                          onEmojiSelect={(emoji) => field.onChange(emoji)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'habitude" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de l'habitude (optionnel)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit">
                {mode === "create" ? "Créer" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
