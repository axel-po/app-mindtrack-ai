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
import { HabitTrackingChart } from "@/app/dashboard/_components/journal/charts/habit-tracking-chart";
import { MoodTrackingChart } from "@/app/dashboard/_components/journal/charts/mood-tracking-chart";

export default async function AnalysisPage() {
  const user = await getUser();

  if (!user) {
    return unauthorized();
  }

  const habits = await getUserHabits(user.id);
  const entries = await getUserJournalEntriesWithHabits(user.id);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analyse</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vue d&apos;ensemble</CardTitle>
          <CardDescription>
            Analyse détaillée de vos habitudes et de votre humeur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Cette page vous permet de visualiser l&apos;évolution de vos
            habitudes et de votre humeur au fil du temps. Utilisez ces
            graphiques pour identifier des tendances et améliorer votre
            bien-être.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HabitTrackingChart entries={entries} habits={habits} />
        <MoodTrackingChart entries={entries} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques globales</CardTitle>
          <CardDescription>Résumé de votre progression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Entrées totales</h3>
              <p className="text-3xl font-bold mt-2">{entries.length}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Habitudes suivies</h3>
              <p className="text-3xl font-bold mt-2">{habits.length}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Taux de complétion</h3>
              <p className="text-3xl font-bold mt-2">
                {habits.length > 0 && entries.length > 0
                  ? Math.round(
                      (entries.reduce(
                        (sum, entry) => sum + entry.completedHabits.length,
                        0
                      ) /
                        (habits.length * entries.length)) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
