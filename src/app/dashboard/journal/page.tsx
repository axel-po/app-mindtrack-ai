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

export default async function JournalPage() {
  const user = await getUser();

  if (!user) {
    return unauthorized();
  }

  const habits = await getUserHabits(user?.id);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <h1 className="text-3xl font-bold">Mes Habitudes</h1>

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
