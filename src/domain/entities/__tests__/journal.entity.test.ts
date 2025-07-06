import { describe, it, expect } from "vitest";
import { JournalEntity } from "../journal.entity";

describe("JournalEntity", () => {
  const mockDate = new Date("2023-01-01");
  const mockCreatedAt = new Date("2023-01-01T10:00:00");
  const mockHabits = [
    {
      id: "1",
      name: "Exercise",
      userId: "user-1",
      description: "Daily exercise",
      emoji: "🏃",
    },
    {
      id: "2",
      name: "Read",
      userId: "user-1",
      description: "Read books",
      emoji: "📚",
    },
  ];

  describe("constructor", () => {
    it("should create a journal entity with all properties", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt,
        mockHabits
      );

      expect(journal.id).toBe("1");
      expect(journal.userId).toBe("user-1");
      expect(journal.date).toBe(mockDate);
      expect(journal.mood).toBe("good");
      expect(journal.thought).toBe("Great day!");
      expect(journal.createdAt).toBe(mockCreatedAt);
      expect(journal.habits).toEqual(mockHabits);
    });

    it("should create a journal entity with null thought and empty habits", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "neutral",
        null,
        mockCreatedAt
      );

      expect(journal.id).toBe("1");
      expect(journal.userId).toBe("user-1");
      expect(journal.date).toBe(mockDate);
      expect(journal.mood).toBe("neutral");
      expect(journal.thought).toBeNull();
      expect(journal.createdAt).toBe(mockCreatedAt);
      expect(journal.habits).toEqual([]);
    });
  });

  describe("isValidJournal", () => {
    it("should return true for a valid journal", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt
      );

      expect(journal.isValidJournal()).toBe(true);
    });

    it("should return false for a journal without userId", () => {
      const journal = new JournalEntity(
        "1",
        "",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt
      );

      expect(journal.isValidJournal()).toBe(false);
    });

    it("should return false for a journal without date", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        null as any,
        "good",
        "Great day!",
        mockCreatedAt
      );

      expect(journal.isValidJournal()).toBe(false);
    });

    it("should return false for a journal with invalid mood", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "invalid" as any,
        "Great day!",
        mockCreatedAt
      );

      expect(journal.isValidJournal()).toBe(false);
    });
  });

  describe("getDisplayDate", () => {
    it("should return formatted date string", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt
      );

      expect(journal.getDisplayDate()).toBe("01/01/2023"); // US format
    });
  });

  describe("getMoodEmoji", () => {
    it("should return 😊 for good mood", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt
      );

      expect(journal.getMoodEmoji()).toBe("😊");
    });

    it("should return 😐 for neutral mood", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "neutral",
        "Okay day",
        mockCreatedAt
      );

      expect(journal.getMoodEmoji()).toBe("😐");
    });

    it("should return 😔 for sad mood", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "sad",
        "Bad day",
        mockCreatedAt
      );

      expect(journal.getMoodEmoji()).toBe("😔");
    });
  });

  describe("getMoodDescription", () => {
    it('should return "Good" for good mood', () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt
      );

      expect(journal.getMoodDescription()).toBe("Good");
    });

    it('should return "Neutral" for neutral mood', () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "neutral",
        "Okay day",
        mockCreatedAt
      );

      expect(journal.getMoodDescription()).toBe("Neutral");
    });

    it('should return "Sad" for sad mood', () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "sad",
        "Bad day",
        mockCreatedAt
      );

      expect(journal.getMoodDescription()).toBe("Sad");
    });
  });

  describe("hasThought", () => {
    it("should return true when thought is present", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt
      );

      expect(journal.hasThought()).toBe(true);
    });

    it("should return false when thought is null", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        null,
        mockCreatedAt
      );

      expect(journal.hasThought()).toBe(false);
    });

    it("should return false when thought is empty", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "",
        mockCreatedAt
      );

      expect(journal.hasThought()).toBe(false);
    });

    it("should return false when thought is only whitespace", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "   ",
        mockCreatedAt
      );

      expect(journal.hasThought()).toBe(false);
    });
  });

  describe("hasHabits", () => {
    it("should return true when habits are present", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt,
        mockHabits
      );

      expect(journal.hasHabits()).toBe(true);
    });

    it("should return false when habits are empty", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt,
        []
      );

      expect(journal.hasHabits()).toBe(false);
    });

    it("should return false when habits are not provided", () => {
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        mockCreatedAt
      );

      expect(journal.hasHabits()).toBe(false);
    });
  });

  describe("isRecent", () => {
    it("should return true for recent journal entry", () => {
      const recentDate = new Date();
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        recentDate
      );

      expect(journal.isRecent()).toBe(true);
    });

    it("should return false for old journal entry", () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10); // 10 days ago
      const journal = new JournalEntity(
        "1",
        "user-1",
        mockDate,
        "good",
        "Great day!",
        oldDate
      );

      expect(journal.isRecent()).toBe(false);
    });
  });
});
