"use server";

import {
  getHabitsByUserId,
  createHabit as createHabitRepo,
  updateHabit as updateHabitRepo,
  deleteHabit as deleteHabitRepo,
} from "@/data/repositories/habit-repository";
import { HabitModel, NewHabitModel } from "@/types/habit-types";

export async function getUserHabits(userId: string) {
  return getHabitsByUserId(userId);
}

export async function createHabit(habit: NewHabitModel) {
  return createHabitRepo(habit);
}

export async function updateHabit(habit: HabitModel) {
  return updateHabitRepo(habit);
}

export async function deleteHabit(id: string) {
  try {
    const result = await deleteHabitRepo(id);
    return result;
  } catch (error) {
    console.error("Service error deleting habit:", error);
    throw error;
  }
}
