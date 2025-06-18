"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HabitChecklist } from "../../habits/habit-checklist";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { HabitModel } from "@/types/habit-types";
import { updateJournalEntry } from "@/app/dashboard/journal/action";
import { toast } from "sonner";
import { MoodSelector } from "../@shared/mood-selector";
import { Separator } from "@/components/ui/separator";
import { JournalEntryWithCompletions } from "@/data/repositories/journal-entries-repository";

const journalEntrySchema = z.object({
  date: z.date(),
  mood: z.enum(["good", "neutral", "sad"] as const),
  thought: z.string().min(3, "Veuillez partager au moins quelques pensées"),
});

type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;

interface JournalEntryEditFormProps {
  className?: string;
  entry: JournalEntryWithCompletions;
  habits: HabitModel[];
  onSuccess?: () => void;
}

export function JournalEntryEditForm({
  className,
  entry,
  habits,
  onSuccess,
}: JournalEntryEditFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedHabits, setSelectedHabits] = React.useState<string[]>(
    entry.completedHabits.map((habit) => habit.id)
  );

  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      date: new Date(entry.date),
      mood: entry.mood,
      thought: entry.thought || "",
    },
  });

  async function onSubmit(values: JournalEntryFormValues) {
    setIsSubmitting(true);

    try {
      const result = await updateJournalEntry(entry.id, {
        date: values.date.toISOString().split("T")[0],
        mood: values.mood,
        thought: values.thought,
      });

      if (result.success) {
        toast.success("Entrée de journal mise à jour avec succès");
        onSuccess?.();
      } else {
        toast.error(
          result.error || "Erreur lors de la mise à jour de l'entrée de journal"
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleToggleHabit = async (habitId: string, isSelected: boolean) => {
    try {
      // La mise à jour des habitudes est gérée séparément par le composant parent
      setSelectedHabits((prev) =>
        isSelected ? [...prev, habitId] : prev.filter((id) => id !== habitId)
      );
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour de l'habitude");
    }
  };

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle>Modifier l&apos;entrée journalière</CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-0 space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de la réflexion</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "d MMMM yyyy", { locale: fr })
                          ) : (
                            <span>Sélectionnez une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        captionLayout="dropdown"
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">
                    Comment vous sentez-vous aujourd&apos;hui ?
                  </FormLabel>
                  <FormControl>
                    <MoodSelector
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="thought"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partagez vos pensées</FormLabel>
                  <FormDescription>
                    Partagez vos réflexions et vos pensées pour la journée
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Qu'avez-vous en tête aujourd'hui ?"
                      className="min-h-32 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="block mb-2">
                Habitudes Quotidiennes
              </FormLabel>
              <HabitChecklist
                habits={habits}
                selectedHabits={selectedHabits}
                onToggleHabit={handleToggleHabit}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
