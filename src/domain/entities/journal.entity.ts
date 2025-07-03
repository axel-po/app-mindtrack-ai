import { Habit } from "@/domain/models/habit.interface";

export class JournalEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly date: Date,
    public readonly mood: number,
    public readonly thought: string | null,
    public readonly createdAt: Date,
    public readonly habits: Habit[] = []
  ) {}

  isValidJournal(): boolean {
    return !!(this.userId && this.date && this.mood >= 1 && this.mood <= 10);
  }

  getDisplayDate(): string {
    return this.date.toLocaleDateString();
  }

  getMoodEmoji(): string {
    if (this.mood >= 8) return "😄";
    if (this.mood >= 6) return "🙂";
    if (this.mood >= 4) return "😐";
    if (this.mood >= 2) return "🙁";
    return "😞";
  }

  getMoodDescription(): string {
    if (this.mood >= 8) return "Great";
    if (this.mood >= 6) return "Good";
    if (this.mood >= 4) return "Neutral";
    if (this.mood >= 2) return "Bad";
    return "Terrible";
  }

  hasThought(): boolean {
    return this.thought !== null && this.thought.trim().length > 0;
  }

  hasHabits(): boolean {
    return this.habits.length > 0;
  }

  isRecent(): boolean {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.createdAt > oneWeekAgo;
  }
}
