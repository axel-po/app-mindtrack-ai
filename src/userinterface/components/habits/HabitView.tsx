"use client";

import React, { useEffect } from "react";
import { useHabitViewModel } from "./HabitViewModel";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/userinterface/components/ui/card";
import { Skeleton } from "@/userinterface/components/ui/skeleton";
import { Toggle } from "@/userinterface/components/ui/toggle";
import { HabitDialog } from "./create/habit-dialog";
import { DeleteHabitDialog } from "./delete/delete-habit-dialog";
import { CheckCircle } from "lucide-react";

export default function HabitView() {
  const {
    habits,
    isLoading,
    error,
    completionStatus,
    loadHabits,
    toggleHabitCompletion,
  } = useHabitViewModel();

  // Load data on component mount
  useEffect(() => {
    loadHabits();
  }, []);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleToggleCompletion = async (habitId: string) => {
    await toggleHabitCompletion(habitId);
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Habitudes</h1>
        <HabitDialog mode="create" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vos habitudes</CardTitle>
          <CardDescription>
            Suivez et gérez vos habitudes quotidiennes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : habits.length > 0 ? (
            <div className="space-y-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between rounded-md border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">
                      {habit.emoji || "✨"}
                    </div>
                    <div>
                      <h3 className="font-medium">{habit.name}</h3>
                      {habit.description && (
                        <p className="text-sm text-muted-foreground">
                          {habit.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Toggle
                      pressed={completionStatus[habit.id] || false}
                      onPressedChange={() => handleToggleCompletion(habit.id)}
                      aria-label={`Toggle completion for ${habit.name}`}
                      className="h-8 w-8 p-0"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Toggle>
                    <HabitDialog mode="edit" habit={habit} />
                    <DeleteHabitDialog habit={habit} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl">
                😊
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Vous n&apos;avez pas encore créé d&apos;habitudes
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Créez votre première habitude pour commencer à suivre votre
                progression
              </p>
              <div className="mt-4">
                <HabitDialog mode="create" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
