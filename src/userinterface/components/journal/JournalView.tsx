"use client";

import React, { useEffect } from "react";
import { useJournalViewModel } from "./JournalViewModel";
import JournalList from "./views/journal-list";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/userinterface/components/ui/card";
import { Skeleton } from "@/userinterface/components/ui/skeleton";
import { JournalCreateDialog } from "./create/journal-create";

export default function JournalView() {
  const { journals, habits, isLoading, error, loadJournals, loadHabits } =
    useJournalViewModel();

  // Load data on component mount
  useEffect(() => {
    loadJournals();
    loadHabits();
  }, []);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Entrées Journalières</CardTitle>
            <CardDescription>
              Suivez votre humeur et vos habitudes quotidiennes
            </CardDescription>
          </div>
          <JournalCreateDialog habits={habits} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : journals.length > 0 ? (
          <JournalList initialJournals={journals} initialHabits={habits} />
        ) : (
          <div className="rounded-lg border p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl">
              😊
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              Commencez à suivre votre progression
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ajoutez votre première entrée journalière pour commencer à suivre
              votre humeur et vos habitudes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
