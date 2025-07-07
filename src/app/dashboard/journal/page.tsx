import { Suspense } from "react";
import JournalList from "@/userinterface/components/journal/views/journal-list";
import { getJournalsByUserIdAction } from "@/userinterface/actions/journal.actions";
import { getUserHabitsAction } from "@/userinterface/actions/habit.actions";
import { getUser } from "@/lib/auth-server";
import { JournalPresentation } from "@/infrastructure/presenters/journal.presenter";
import { HabitPresentation } from "@/infrastructure/presenters/habit.presenter";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Button } from "@/userinterface/components/ui/button";

// Page title and description
export const metadata = {
  title: "Journal - MindTrack",
  description: "Consultez et gérez vos entrées de journal",
};

export default async function JournalPage() {
  // Get current user session
  const user = await getUser();
  const userId = user?.id;

  // Pre-fetch data for initial render if user is authenticated
  let journals: JournalPresentation[] = [];
  let habits: HabitPresentation[] = [];

  if (userId) {
    const journalsResult = await getJournalsByUserIdAction(userId);
    if (journalsResult.data) {
      journals = journalsResult.data;
    }

    const habitsResult = await getUserHabitsAction(userId);
    if (habitsResult.data) {
      habits = habitsResult.data;
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
          <p className="text-muted-foreground">
            Consultez et gérez vos entrées de journal quotidien
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Filtrer par date
          </Button>
          <Button size="sm" className="h-9">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvelle entrée
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-1 sm:p-6">
          <Suspense
            fallback={
              <div className="py-20 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-muted-foreground">
                  Chargement des données...
                </p>
              </div>
            }
          >
            <JournalList
              initialJournals={journals}
              initialHabits={habits}
              entriesPerPage={30}
            />
          </Suspense>
        </div>
      </div>

      <div className="bg-muted/40 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-medium mb-2">
          Conseils pour votre journal
        </h3>
        <p className="text-muted-foreground">
          Prenez l&apos;habitude d&apos;écrire dans votre journal
          quotidiennement pour suivre votre progression et identifier les
          tendances de votre humeur au fil du temps.
        </p>
      </div>
    </div>
  );
}
