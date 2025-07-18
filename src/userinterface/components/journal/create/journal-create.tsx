"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateJournalViewModel,
  JournalFormData,
} from "./journal-create.viewmodel";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { IconCalendarPlus } from "@tabler/icons-react";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import { MoodType } from "@/domain/models/journal.interface";

import { Button } from "@/userinterface/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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

// Schema for form validation
const journalEntrySchema = z.object({
  date: z.date(),
  mood: z.enum(["good", "neutral", "sad"] as const),
  thought: z.string().min(1, "Veuillez partager au moins quelques pensées"),
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
    <div className="flex justify-center gap-6 py-2">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          data-testid={`mood-${mood.value}`}
          onClick={() => onValueChange(mood.value)}
          className={cn(
            "flex flex-col items-center rounded-lg p-3 transition-all",
            value === mood.value
              ? "bg-primary/10 ring-1 ring-primary"
              : "hover:bg-muted"
          )}
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span className="mt-1 text-sm font-medium">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}

// Habit checklist component
function HabitChecklist({
  habits,
  selectedHabits,
  onToggleHabit,
}: {
  habits: HabitPresentation[];
  selectedHabits: string[];
  onToggleHabit: (habitId: string, isSelected: boolean) => void;
}) {
  if (!habits.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune habitude disponible
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {habits.map((habit) => {
        const isSelected = selectedHabits.includes(habit.id);
        return (
          <div
            key={habit.id}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md border p-2 transition-colors",
              isSelected
                ? "border-primary/50 bg-primary/5"
                : "border-border hover:bg-muted/50"
            )}
            onClick={() => onToggleHabit(habit.id, !isSelected)}
          >
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded border",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground"
              )}
            >
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base">{habit.emoji}</span>
              <span className="text-sm">{habit.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Journal entry form component
function JournalEntryForm({
  habits,
  onSuccess,
}: {
  habits: HabitPresentation[];
  onSuccess?: () => void;
}) {
  const { createJournal, isLoading } = useCreateJournalViewModel();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      date: new Date(),
      mood: "neutral",
      thought: "",
    },
  });

  async function onSubmit(values: JournalEntryFormValues) {
    const journalData: JournalFormData = {
      date: values.date,
      mood: values.mood,
      thought: values.thought,
      habitIds: selectedHabits.length > 0 ? selectedHabits : undefined,
    };

    const result = await createJournal(journalData);

    if (result) {
      form.reset();
      setSelectedHabits([]);
      onSuccess?.();
    }
  }

  const handleToggleHabit = (habitId: string, isSelected: boolean) => {
    setSelectedHabits((prev) =>
      isSelected ? [...prev, habitId] : prev.filter((id) => id !== habitId)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
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
                          <span>Choisir une date</span>
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-2" />

          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center block text-sm font-medium text-muted-foreground">
                  Comment vous sentez-vous aujourd&apos;hui ?
                </FormLabel>
                <FormControl>
                  <div data-testid="mood-selector">
                    <MoodSelector
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-2" />

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
                    className="min-h-28 resize-none focus-visible:ring-primary"
                    data-testid="journal-thought-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-muted-foreground">
              Habitudes Quotidiennes
            </FormLabel>
            <HabitChecklist
              habits={habits}
              selectedHabits={selectedHabits}
              onToggleHabit={handleToggleHabit}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isLoading}
            data-testid="save-journal-button"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer la réflexion"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function JournalCreateDialog({
  habits,
  onSuccess,
}: {
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
        <Button
          className="flex items-center gap-2"
          data-testid="new-journal-entry-button"
        >
          <IconCalendarPlus size={18} />
          <span>Nouvelle entrée</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Nouvelle entrée journalière</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="mt-4">
          <JournalEntryForm habits={habits} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
