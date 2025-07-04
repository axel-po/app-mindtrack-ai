import { Journal, MoodType } from "@/domain/models/journal.interface";
import { HabitPresentation, HabitPresenter } from "./habit.presenter";

export interface JournalPresentation {
  id: string;
  userId: string;
  date: string;
  mood: MoodType;
  moodEmoji: string;
  moodDescription: string;
  thought: string;
  createdAt: string;
  habits: HabitPresentation[];
}

const moodConfig: Record<MoodType, { emoji: string; description: string }> = {
  good: { emoji: "😊", description: "Good" },
  neutral: { emoji: "😐", description: "Neutral" },
  sad: { emoji: "😔", description: "Sad" },
};

export class JournalPresenter {
  static toPresentation(journal: Journal): JournalPresentation {
    const date = new Date(journal.date);
    const mood = journal.mood as MoodType;
    const { emoji: moodEmoji, description: moodDescription } =
      moodConfig[mood] || moodConfig.neutral;

    return {
      id: journal.id,
      userId: journal.userId,
      date: date.toISOString().split("T")[0],
      mood: mood,
      moodEmoji,
      moodDescription,
      thought: journal.thought || "",
      createdAt: journal.createdAt
        ? new Date(journal.createdAt).toISOString()
        : new Date().toISOString(),
      habits: journal.habits
        ? HabitPresenter.toPresentationList(journal.habits)
        : [],
    };
  }

  static toPresentationList(journals: Journal[]): JournalPresentation[] {
    return journals.map(this.toPresentation);
  }
}
