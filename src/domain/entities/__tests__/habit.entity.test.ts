import { describe, it, expect } from "vitest";
import { HabitEntity } from "../habit.entity";

describe("HabitEntity", () => {
  describe("constructor", () => {
    it("should create a habit entity with all properties", () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "Test Habit",
        "Test description",
        "🎯"
      );

      expect(habit.id).toBe("1");
      expect(habit.userId).toBe("user-1");
      expect(habit.name).toBe("Test Habit");
      expect(habit.description).toBe("Test description");
      expect(habit.emoji).toBe("🎯");
    });

    it("should create a habit entity with null description and emoji", () => {
      const habit = new HabitEntity("1", "user-1", "Test Habit", null, null);

      expect(habit.id).toBe("1");
      expect(habit.userId).toBe("user-1");
      expect(habit.name).toBe("Test Habit");
      expect(habit.description).toBeNull();
      expect(habit.emoji).toBeNull();
    });
  });

  describe("isValidHabit", () => {
    it("should return true for a valid habit", () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "Test Habit",
        "Test description",
        "🎯"
      );

      expect(habit.isValidHabit()).toBe(true);
    });

    it("should return false for a habit without userId", () => {
      const habit = new HabitEntity(
        "1",
        "",
        "Test Habit",
        "Test description",
        "🎯"
      );

      expect(habit.isValidHabit()).toBe(false);
    });

    it("should return false for a habit without name", () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "",
        "Test description",
        "🎯"
      );

      expect(habit.isValidHabit()).toBe(false);
    });

    it("should return false for a habit with empty name", () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "",
        "Test description",
        "🎯"
      );

      expect(habit.isValidHabit()).toBe(false);
    });
  });

  describe("getDisplayName", () => {
    it("should return the habit name", () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "Test Habit",
        "Test description",
        "🎯"
      );

      expect(habit.getDisplayName()).toBe("Test Habit");
    });

    it('should return "Unnamed Habit" for empty name', () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "",
        "Test description",
        "🎯"
      );

      expect(habit.getDisplayName()).toBe("Unnamed Habit");
    });
  });

  describe("getDisplayDescription", () => {
    it("should return the habit description", () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "Test Habit",
        "Test description",
        "🎯"
      );

      expect(habit.getDisplayDescription()).toBe("Test description");
    });

    it('should return "No description available" for null description', () => {
      const habit = new HabitEntity("1", "user-1", "Test Habit", null, "🎯");

      expect(habit.getDisplayDescription()).toBe("No description available");
    });

    it('should return "No description available" for empty description', () => {
      const habit = new HabitEntity("1", "user-1", "Test Habit", "", "🎯");

      expect(habit.getDisplayDescription()).toBe("No description available");
    });
  });

  describe("getDisplayEmoji", () => {
    it("should return the habit emoji", () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "Test Habit",
        "Test description",
        "🎯"
      );

      expect(habit.getDisplayEmoji()).toBe("🎯");
    });

    it('should return "📝" for null emoji', () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "Test Habit",
        "Test description",
        null
      );

      expect(habit.getDisplayEmoji()).toBe("📝");
    });

    it('should return "📝" for empty emoji', () => {
      const habit = new HabitEntity(
        "1",
        "user-1",
        "Test Habit",
        "Test description",
        ""
      );

      expect(habit.getDisplayEmoji()).toBe("📝");
    });
  });
});
