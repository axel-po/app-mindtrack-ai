"use server";

import { habitContainer } from "@/di/habit.ioc";
import { HabitPresenter } from "@/infrastructure/presenters/habit.presenter";
import { Habit } from "@/domain/models/habit.interface";

export async function getUserHabitsAction(userId: string) {
  try {
    const { data, error } = await habitContainer.habitUseCase.getUserHabits(
      userId
    );

    if (error) {
      console.error("Error in getUserHabitsAction:", error);
      return { data: [], error: error.message };
    }

    const presentedData = HabitPresenter.toPresentationList(data);
    return { data: presentedData, error: null };
  } catch (error) {
    console.error("Unexpected error in getUserHabitsAction:", error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createHabitAction(habitData: Omit<Habit, "id">) {
  try {
    const { data, error } = await habitContainer.habitUseCase.createHabit(
      habitData
    );

    if (error) {
      console.error("Error in createHabitAction:", error);
      return { data: null, error: error.message };
    }

    const presentedData = data ? HabitPresenter.toPresentation(data) : null;
    return { data: presentedData, error: null };
  } catch (error) {
    console.error("Unexpected error in createHabitAction:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateHabitAction(
  id: string,
  habitData: Partial<Omit<Habit, "id" | "userId">>
) {
  try {
    const { data, error } = await habitContainer.habitUseCase.updateHabit(
      id,
      habitData
    );

    if (error) {
      console.error("Error in updateHabitAction:", error);
      return { data: null, error: error.message };
    }

    const presentedData = data ? HabitPresenter.toPresentation(data) : null;
    return { data: presentedData, error: null };
  } catch (error) {
    console.error("Unexpected error in updateHabitAction:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteHabitAction(id: string) {
  try {
    const { success, error } = await habitContainer.habitUseCase.deleteHabit(
      id
    );

    if (error) {
      console.error("Error in deleteHabitAction:", error);
      return { success: false, error: error.message };
    }

    return { success, error: null };
  } catch (error) {
    console.error("Unexpected error in deleteHabitAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function toggleHabitCompletionAction(
  habitId: string,
  userId: string,
  date: string = new Date().toISOString().split("T")[0]
) {
  try {
    const { success, isCompleted, error } =
      await habitContainer.habitUseCase.toggleHabitCompletion(
        habitId,
        userId,
        date
      );

    if (error) {
      console.error("Error in toggleHabitCompletionAction:", error);
      return { success: false, isCompleted: false, error: error.message };
    }

    return { success, isCompleted, error: null };
  } catch (error) {
    console.error("Unexpected error in toggleHabitCompletionAction:", error);
    return {
      success: false,
      isCompleted: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
