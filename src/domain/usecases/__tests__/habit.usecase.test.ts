import { describe, it, expect, vi, beforeEach } from "vitest";
import { HabitUseCase } from "../habit.usecase";
import { HabitRepository, Habit } from "@/domain/models/habit.interface";

// Mock repository
const mockHabitRepository: HabitRepository = {
  getUserHabits: vi.fn(),
  createHabit: vi.fn(),
  updateHabit: vi.fn(),
  deleteHabit: vi.fn(),
  toggleHabitCompletion: vi.fn(),
};

describe("HabitUseCase", () => {
  let habitUseCase: HabitUseCase;

  const mockHabit: Habit = {
    id: "1",
    userId: "user-1",
    name: "Exercise",
    description: "Daily exercise routine",
    emoji: "💪",
  };

  beforeEach(() => {
    habitUseCase = new HabitUseCase(mockHabitRepository);
    vi.clearAllMocks();
  });

  describe("getUserHabits", () => {
    it("should return user habits successfully", async () => {
      const mockHabits = [mockHabit];
      vi.mocked(mockHabitRepository.getUserHabits).mockResolvedValue({
        data: mockHabits,
      });

      const result = await habitUseCase.getUserHabits("user-1");

      expect(result).toEqual({ data: mockHabits });
      expect(mockHabitRepository.getUserHabits).toHaveBeenCalledWith("user-1");
    });

    it("should handle repository errors", async () => {
      const mockError = new Error("Database error");
      vi.mocked(mockHabitRepository.getUserHabits).mockRejectedValue(mockError);

      const result = await habitUseCase.getUserHabits("user-1");

      expect(result).toEqual({ data: [], error: mockError });
      expect(mockHabitRepository.getUserHabits).toHaveBeenCalledWith("user-1");
    });
  });

  describe("createHabit", () => {
    const habitData = {
      userId: "user-1",
      name: "Exercise",
      description: "Daily exercise routine",
      emoji: "💪",
    };

    it("should create habit successfully", async () => {
      vi.mocked(mockHabitRepository.createHabit).mockResolvedValue({
        data: mockHabit,
      });

      const result = await habitUseCase.createHabit(habitData);

      expect(result).toEqual({ data: mockHabit });
      expect(mockHabitRepository.createHabit).toHaveBeenCalledWith(habitData);
    });

    it("should validate habit data before creation", async () => {
      const invalidHabitData = {
        userId: "",
        name: "",
        description: "Daily exercise routine",
        emoji: "💪",
      };

      const result = await habitUseCase.createHabit(invalidHabitData);

      expect(result.data).toBeNull();
      expect(result.error).toEqual(new Error("Invalid habit data"));
      expect(mockHabitRepository.createHabit).not.toHaveBeenCalled();
    });

    it("should handle repository errors", async () => {
      const mockError = new Error("Database error");
      vi.mocked(mockHabitRepository.createHabit).mockRejectedValue(mockError);

      const result = await habitUseCase.createHabit(habitData);

      expect(result).toEqual({ data: null, error: mockError });
      expect(mockHabitRepository.createHabit).toHaveBeenCalledWith(habitData);
    });
  });

  describe("updateHabit", () => {
    const updateData = {
      name: "Updated Exercise",
      description: "Updated description",
    };

    it("should update habit successfully", async () => {
      const updatedHabit = { ...mockHabit, ...updateData };
      vi.mocked(mockHabitRepository.updateHabit).mockResolvedValue({
        data: updatedHabit,
      });

      const result = await habitUseCase.updateHabit("1", updateData);

      expect(result).toEqual({ data: updatedHabit });
      expect(mockHabitRepository.updateHabit).toHaveBeenCalledWith(
        "1",
        updateData
      );
    });

    it("should handle repository errors", async () => {
      const mockError = new Error("Database error");
      vi.mocked(mockHabitRepository.updateHabit).mockRejectedValue(mockError);

      const result = await habitUseCase.updateHabit("1", updateData);

      expect(result).toEqual({ data: null, error: mockError });
      expect(mockHabitRepository.updateHabit).toHaveBeenCalledWith(
        "1",
        updateData
      );
    });
  });

  describe("deleteHabit", () => {
    it("should delete habit successfully", async () => {
      vi.mocked(mockHabitRepository.deleteHabit).mockResolvedValue({
        success: true,
      });

      const result = await habitUseCase.deleteHabit("1");

      expect(result).toEqual({ success: true });
      expect(mockHabitRepository.deleteHabit).toHaveBeenCalledWith("1");
    });

    it("should handle repository errors", async () => {
      const mockError = new Error("Database error");
      vi.mocked(mockHabitRepository.deleteHabit).mockRejectedValue(mockError);

      const result = await habitUseCase.deleteHabit("1");

      expect(result).toEqual({ success: false, error: mockError });
      expect(mockHabitRepository.deleteHabit).toHaveBeenCalledWith("1");
    });
  });

  describe("toggleHabitCompletion", () => {
    it("should toggle habit completion successfully", async () => {
      vi.mocked(mockHabitRepository.toggleHabitCompletion).mockResolvedValue({
        success: true,
        isCompleted: true,
      });

      const result = await habitUseCase.toggleHabitCompletion(
        "1",
        "user-1",
        "2023-01-01"
      );

      expect(result).toEqual({ success: true, isCompleted: true });
      expect(mockHabitRepository.toggleHabitCompletion).toHaveBeenCalledWith(
        "1",
        "user-1",
        "2023-01-01"
      );
    });

    it("should use current date when no date is provided", async () => {
      const today = new Date().toISOString().split("T")[0];
      vi.mocked(mockHabitRepository.toggleHabitCompletion).mockResolvedValue({
        success: true,
        isCompleted: true,
      });

      const result = await habitUseCase.toggleHabitCompletion("1", "user-1");

      expect(result).toEqual({ success: true, isCompleted: true });
      expect(mockHabitRepository.toggleHabitCompletion).toHaveBeenCalledWith(
        "1",
        "user-1",
        today
      );
    });

    it("should handle repository errors", async () => {
      const mockError = new Error("Database error");
      vi.mocked(mockHabitRepository.toggleHabitCompletion).mockRejectedValue(
        mockError
      );

      const result = await habitUseCase.toggleHabitCompletion(
        "1",
        "user-1",
        "2023-01-01"
      );

      expect(result).toEqual({
        success: false,
        isCompleted: false,
        error: mockError,
      });
      expect(mockHabitRepository.toggleHabitCompletion).toHaveBeenCalledWith(
        "1",
        "user-1",
        "2023-01-01"
      );
    });
  });
});
