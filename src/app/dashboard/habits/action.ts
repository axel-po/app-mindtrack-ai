"use server";

import {
  createHabit as createHabitService,
  updateHabit as updateHabitService,
  deleteHabit as deleteHabitService,
} from "@/services/habits-service";
import { HabitModel, NewHabitModel } from "@/types/habit-types";
import { revalidatePath } from "next/cache";

export async function createHabit(habit: NewHabitModel) {
  try {
    const result = await createHabitService(habit);
    revalidatePath("/dashboard/habits");
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating habit:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création de l'habitude",
    };
  }
}

export async function updateHabit(habit: HabitModel) {
  try {
    const result = await updateHabitService(habit);
    revalidatePath("/dashboard/habits");
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error updating habit:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour de l'habitude",
    };
  }
}

export async function deleteHabit(id: string) {
  try {
    const result = await deleteHabitService(id);

    revalidatePath("/dashboard/habits");
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error deleting habit:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression de l'habitude",
    };
  }
}
