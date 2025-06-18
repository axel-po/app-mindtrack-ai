import { Habit } from "@/data/models/habits-model";
import { Card } from "@/components/ui/card";

interface HabitProgressListProps {
  habits: Habit[];
  userId: string; // Conservé pour de futures fonctionnalités (ex: récupérer les données de progression)
}

export function HabitProgressList({ habits }: HabitProgressListProps) {
  // Simuler des données de progression pour la démonstration
  const getRandomProgress = () => Math.floor(Math.random() * 100);

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const progress = getRandomProgress();

        return (
          <Card key={habit.id} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">{habit.emoji || "✅"}</div>
              <div>
                <h3 className="font-medium">{habit.name}</h3>
                {habit.description && (
                  <p className="text-sm text-muted-foreground">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>Progression</span>
                <span>{progress}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
