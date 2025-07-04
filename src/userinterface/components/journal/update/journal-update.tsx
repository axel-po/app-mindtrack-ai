"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJournalViewModel } from "../JournalViewModel";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { IconEdit } from "@tabler/icons-react";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import { MoodType } from "@/domain/models/journal.interface";

import { Button } from "@/userinterface/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/userinterface/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/userinterface/components/ui/form";
import { Textarea } from "@/userinterface/components/ui/textarea";
import { Calendar } from "@/userinterface/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/userinterface/components/ui/popover";
import { Separator } from "@/userinterface/components/ui/separator";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/userinterface/components/ui/checkbox";

// Schema for form validation
const journalEntrySchema = z.object({
  date: z.date(),
  mood: z.enum(["good", "neutral", "sad"] as const),
  thought: z.string().min(3, "Veuillez partager au moins quelques pensées"),
  habitIds: z.array(z.string()).optional(),
});

type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;

// MoodSelector component
function MoodSelector({
  value,
  onValueChange,
}: {
  value: MoodType;
  onValueChange: (value: MoodType) => void;
}) {
  const moods = [
    { value: "good" as const, emoji: "😊", label: "Heureux" },
    { value: "neutral" as const, emoji: "😐", label: "Neutre" },
    { value: "sad" as const, emoji: "😔", label: "Triste" },
  ];

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-center gap-6">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onValueChange(mood.value)}
            className={cn(
              "flex flex-col items-center rounded-lg p-3 transition-all",
              value === mood.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <span className="text-4xl">{mood.emoji}</span>
            <span className="mt-1 text-xs font-medium text-muted-foreground">
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// HabitChecklist component
function HabitChecklist({
  habits,
  selectedHabits,
  onToggleHabit,
}: {
  habits: HabitPresentation[];
  selectedHabits: string[];
  onToggleHabit: (habitId: string, isSelected: boolean) => void;
}) {
  if (habits.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune habitude à suivre. Créez des habitudes pour les suivre ici.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
        >
          <Checkbox
            id={`habit-${habit.id}`}
            checked={selectedHabits.includes(habit.id)}
            onCheckedChange={(checked) => onToggleHabit(habit.id, !!checked)}
          />
          <label
            htmlFor={`habit-${habit.id}`}
            className="flex flex-1 cursor-pointer items-center gap-2 text-sm"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-lg">
              {habit.emoji || "✨"}
            </span>
            <span>{habit.name}</span>
          </label>
        </div>
      ))}
    </div>
  );
}

// Journal entry edit form component
function JournalEntryEditForm({
  className,
  entry,
  habits,
  onSuccess,
}: {
  className?: string;
  entry: JournalPresentation;
  habits: HabitPresentation[];
  onSuccess?: () => void;
}) {
  const { updateJournal } = useJournalViewModel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(
    entry.habits?.map((habit) => habit.id) || []
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
      const result = await updateJournal(entry.id, {
        date: values.date,
        mood: values.mood,
        thought: values.thought,
        habitIds: selectedHabits,
      });

      if (result) {
        toast.success("Entrée de journal mise à jour avec succès");
        onSuccess?.();
      } else {
        toast.error("Erreur lors de la mise à jour de l'entrée de journal");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleToggleHabit = (habitId: string, isSelected: boolean) => {
    setSelectedHabits((prev) =>
      isSelected ? [...prev, habitId] : prev.filter((id) => id !== habitId)
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Date de la réflexion
                </FormLabel>
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

          <Separator className="my-6" />

          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 block text-center text-sm font-medium text-muted-foreground">
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

          <Separator className="my-6" />

          <FormField
            control={form.control}
            name="thought"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Partagez vos pensées
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Qu'avez-vous en tête aujourd'hui ?"
                    className="min-h-32 resize-y border-muted bg-muted/5 focus-visible:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="mb-3 block text-sm font-medium text-muted-foreground">
              Habitudes Quotidiennes
            </FormLabel>
            <HabitChecklist
              habits={habits}
              selectedHabits={selectedHabits}
              onToggleHabit={handleToggleHabit}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
              disabled={isSubmitting}
              className="text-sm"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-sm">
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Main dialog component for editing journal entries
export function JournalUpdateDialog({
  entry,
  habits,
  onSuccess,
}: {
  entry: JournalPresentation;
  habits: HabitPresentation[];
  onSuccess?: () => void;
}) {
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
      <DialogContent className="max-w-md p-6 sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium">
            Modifier l&apos;entrée journalière
          </DialogTitle>
        </DialogHeader>
        <JournalEntryEditForm
          className="mt-4"
          entry={entry}
          habits={habits}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
