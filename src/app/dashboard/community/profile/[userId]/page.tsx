import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserWithHabits } from "@/services/user-service";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { HabitProgressList } from "@/app/dashboard/community/_components/habit-progress-list";
import { HabitVisualization } from "@/app/dashboard/community/_components/habit-visualization";
import { ArrowLeft } from "lucide-react";

interface UserProfilePageProps {
  params: {
    userId: string;
  };
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { userId } = params;
  const userWithHabits = await getUserWithHabits(userId);

  if (!userWithHabits) {
    notFound();
  }

  const { user, habits } = userWithHabits;

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <Link
          href="/dashboard/community"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à la communauté</span>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <div className="bg-primary/10 h-full w-full flex items-center justify-center rounded-full text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Avatar>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground mt-1">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Membre depuis {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Habitudes</h2>
            {habits.length > 0 ? (
              <HabitProgressList habits={habits} userId={userId} />
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Cet utilisateur n&apos;a pas encore créé d&apos;habitudes
                </p>
              </div>
            )}
          </Card>

          {habits.length > 0 && (
            <div className="mt-6">
              <HabitVisualization habits={habits} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
