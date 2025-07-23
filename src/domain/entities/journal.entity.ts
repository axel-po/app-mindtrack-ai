import { Habit } from "@/domain/models/habit.interface";
import { MoodType } from "@/domain/models/journal.interface";

export class JournalEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly date: Date,
    public readonly mood: MoodType,
    public readonly thought: string | null,
    public readonly createdAt: Date,
    public readonly habits: Habit[] = []
  ) {}

  isValidJournal(): boolean {
    return !!(
      this.userId &&
      this.date &&
      ["good", "neutral", "sad"].includes(this.mood)
    );
  }

  getDisplayDate(): string {
    return this.date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }

  getMoodEmoji(): string {
    switch (this.mood) {
      case "good":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😔";
      default:
        return "😐"; // Default case
    }
  }

  getMoodDescription(): string {
    switch (this.mood) {
      case "good":
        return "Good";
      case "neutral":
        return "Neutral";
      case "sad":
        return "Sad";
      default:
        return "Neutral"; // Default case
    }
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
