import { Journal } from "@/domain/models/journal.interface";
import { HabitPresentation, HabitPresenter } from "./habit.presenter";

export interface JournalPresentation {
  id: string;
  userId: string;
  date: string;
  mood: number;
  moodEmoji: string;
  moodDescription: string;
  thought: string;
  createdAt: string;
  habits: HabitPresentation[];
}

export class JournalPresenter {
  static toPresentation(journal: Journal): JournalPresentation {
    const date = new Date(journal.date);

    let moodEmoji = "😐";
    let moodDescription = "Neutral";

    const moodValue = Number(journal.mood);

    if (moodValue >= 8) {
      moodEmoji = "😄";
      moodDescription = "Great";
    } else if (moodValue >= 6) {
      moodEmoji = "🙂";
      moodDescription = "Good";
    } else if (moodValue >= 4) {
      moodEmoji = "😐";
      moodDescription = "Neutral";
    } else if (moodValue >= 2) {
      moodEmoji = "🙁";
      moodDescription = "Bad";
    } else {
      moodEmoji = "😞";
      moodDescription = "Terrible";
    }

    return {
      id: journal.id,
      userId: journal.userId,
      date: date.toISOString().split("T")[0],
      mood: Number(journal.mood),
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
