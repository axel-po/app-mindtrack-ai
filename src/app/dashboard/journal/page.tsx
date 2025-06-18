import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { unauthorized } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import { getUserHabits } from "@/services/habits-service";
import { getUserJournalEntriesWithHabits } from "@/services/journal-entries-service";
import { JournalEntryList } from "@/app/dashboard/_components/journal/data/journal-entry-list";
import { JournalEntryButton } from "@/app/dashboard/_components/journal/@shared/journal-entry-button";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JournalPage() {
  const user = await getUser();

  if (!user) {
    return unauthorized();
  }

  const habits = await getUserHabits(user?.id);
  const entries = await getUserJournalEntriesWithHabits(user.id);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <h1 className="text-3xl font-bold">Journal</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Entrées Journalières</CardTitle>
              <CardDescription>
                Suivez votre humeur et vos habitudes quotidiennes
              </CardDescription>
            </div>
            <JournalEntryButton habits={habits} />
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Chargement des entrées...</div>}>
            {entries.length > 0 ? (
              <JournalEntryList entries={entries} habits={habits} />
            ) : (
              <div className="rounded-lg border p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl">
                  😊
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Commencez à suivre votre progression
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ajoutez votre première entrée journalière pour commencer à
                  suivre votre humeur et vos habitudes.
                </p>
              </div>
            )}
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vos habitudes</CardTitle>
          <CardDescription>
            Suivez et gérez vos habitudes quotidiennes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <h3 className="mt-4 text-lg font-semibold">
                Vous n&apos;avez pas encore créé d&apos;habitudes
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Créez votre première habitude pour commencer à suivre votre
                progression
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between rounded-md border p-4"
                >
                  <div>
                    <h3 className="font-medium">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
