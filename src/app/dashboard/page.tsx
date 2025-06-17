import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JournalEntryButton } from "@/app/dashboard/_components/journal/@shared/journal-entry-button";
import { JournalEntryList } from "@/app/dashboard/_components/journal/data/journal-entry-list";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { unauthorized } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import { getUserHabits } from "@/services/habits-service";
import { getUserJournalEntriesWithHabits } from "@/services/journal-entries-service";
import { HabitTrackingChart } from "@/app/dashboard/_components/journal/charts/habit-tracking-chart";
import { MoodTrackingChart } from "@/app/dashboard/_components/journal/charts/mood-tracking-chart";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    return unauthorized();
  }

  const habits = await getUserHabits(user.id);
  const entries = await getUserJournalEntriesWithHabits(user.id);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <SectionCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HabitTrackingChart entries={entries} habits={habits} />
        <MoodTrackingChart entries={entries} />
      </div>

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
        </CardContent>
      </Card>

      <ChartAreaInteractive />
    </div>
  );
}
