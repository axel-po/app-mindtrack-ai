import { vi } from "vitest";
import { HabitEntity } from "@/domain/entities/habit.entity";
import { JournalEntity } from "@/domain/entities/journal.entity";
import { ReactElement, ReactNode } from "react";

// Mock data generators
export const createMockHabit = (
  id: string = "habit-1",
  userId: string = "user-1",
  name: string = "Test Habit",
  description: string | null = "Test habit description",
  emoji: string | null = "🎯"
): HabitEntity => {
  return new HabitEntity(id, userId, name, description, emoji);
};

export const createMockJournal = (
  id: string = "journal-1",
  userId: string = "user-1",
  date: Date = new Date(),
  mood: "good" | "neutral" | "sad" = "good",
  thought: string | null = "Test journal thought",
  createdAt: Date = new Date(),
  habits: {
    id: string;
    name: string;
    userId: string;
    description: string | null;
    emoji: string | null;
  }[] = []
): JournalEntity => {
  return new JournalEntity(id, userId, date, mood, thought, createdAt, habits);
};

// Database mock helpers
export const mockDbSelect = () => ({
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  leftJoin: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  groupBy: vi.fn().mockReturnThis(),
  having: vi.fn().mockReturnThis(),
});

export const mockDbInsert = () => ({
  into: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn().mockReturnThis(),
  onConflictDoNothing: vi.fn().mockReturnThis(),
  onConflictDoUpdate: vi.fn().mockReturnThis(),
});

export const mockDbUpdate = () => ({
  table: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  returning: vi.fn().mockReturnThis(),
});

export const mockDbDelete = () => ({
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  returning: vi.fn().mockReturnThis(),
});

// Test user mock
export const mockUser = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  image: "https://example.com/avatar.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Session mock
export const mockSession = {
  user: mockUser,
  token: "mock-token",
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
};

// React Testing Library utilities
export const renderWithProviders = (
  ui: ReactElement,
  options?: Record<string, unknown>
) => {
  const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return children;
  };

  return { AllTheProviders, ...options };
};

// Wait for async operations
export const waitFor = (fn: () => void, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      try {
        fn();
        resolve(true);
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, 100);
        }
      }
    };

    check();
  });
};
