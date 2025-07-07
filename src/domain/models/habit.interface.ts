import { habits } from "@/infrastructure/database/schemas/habits.schema";

// Use the inferred type from Drizzle schema
export type Habit = typeof habits.$inferSelect;

// Repository interface
export interface HabitRepository {
  getUserHabits(userId: string): Promise<{ data: Habit[]; error?: Error }>;

  createHabit(
    habit: Omit<Habit, "id">
  ): Promise<{ data: Habit | null; error?: Error }>;

  updateHabit(
    id: string,
    habitData: Partial<Omit<Habit, "id" | "userId">>
  ): Promise<{ data: Habit | null; error?: Error }>;

  deleteHabit(id: string): Promise<{ success: boolean; error?: Error }>;

  toggleHabitCompletion(
    habitId: string,
    userId: string,
    date: string
  ): Promise<{ success: boolean; isCompleted: boolean; error?: Error }>;
}
