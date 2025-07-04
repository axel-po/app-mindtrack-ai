"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateJournalViewModel,
  JournalFormData,
} from "./CreateJournalViewModel";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { IconCalendarPlus } from "@tabler/icons-react";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import { MoodType } from "@/domain/models/journal.interface";

import { Button } from "@/userinterface/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/userinterface/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/userinterface/components/ui/card";

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
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-center font-medium">
        Comment vous sentez-vous aujourd&apos;hui ?
      </h3>
      <div className="flex justify-center gap-4">
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
            <span className="text-3xl">{mood.emoji}</span>
            <span className="mt-1 text-sm">{mood.label}</span>
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
    <div className="space-y-2">
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center gap-2 rounded-lg border p-3"
        >
          <input
            type="checkbox"
            id={`habit-${habit.id}`}
            checked={selectedHabits.includes(habit.id)}
            onChange={(e) => onToggleHabit(habit.id, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label
            htmlFor={`habit-${habit.id}`}
            className="flex flex-1 cursor-pointer items-center gap-2"
          >
            <span className="text-lg">{habit.emoji || "✨"}</span>
            <span>{habit.name}</span>
          </label>
        </div>
      ))}
    </div>
  );
}

// Journal entry form component
function JournalEntryForm({
  className,
  habits,
  onSuccess,
}: {
  className?: string;
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
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle>Nouvelle entrée journalière</CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
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
              disabled={isLoading}
            >
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer la réflexion"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export function JournalCreateDialog({
  habits,
}: {
  habits: HabitPresentation[];
}) {
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
