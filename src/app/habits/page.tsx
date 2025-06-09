import { AppSidebar } from "@/components/@shared/sidebar/app-sidebar";
import { SiteHeader } from "@/components/@shared/nav/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
import { HabitDialog } from "./_components/habit-dialog";
import { DeleteHabitDialog } from "./_components/delete-habit-dialog";

export default async function HabitsPage() {
  const user = await getUser();

  if (!user) {
    return unauthorized();
  }

  const habits = await getUserHabits(user?.id);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
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
                  {habits.length === 0 ? (
                    <div className="rounded-lg border p-8 text-center">
                      <h3 className="mt-4 text-lg font-semibold">
                        Vous n&apos;avez pas encore créé d&apos;habitudes
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Créez votre première habitude pour commencer à suivre
                        votre progression
                      </p>
                      <div className="mt-4">
                        <HabitDialog mode="create" />
                      </div>
                    </div>
                  ) : (
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
                            <HabitDialog mode="edit" habit={habit} />
                            <DeleteHabitDialog habit={habit} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
