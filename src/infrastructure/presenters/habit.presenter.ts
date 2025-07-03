import { Habit } from "@/domain/models/habit.interface";

export interface HabitPresentation {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export class HabitPresenter {
  static toPresentation(habit: Habit): HabitPresentation {
    return {
      id: habit.id,
      name: habit.name,
      description: habit.description || "",
      emoji: habit.emoji || "📝",
    };
  }

  static toPresentationList(habits: Habit[]): HabitPresentation[] {
    return habits.map(this.toPresentation);
  }
}
