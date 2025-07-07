"use server";

import { journalContainer } from "@/di/journal.ioc";
import { JournalPresenter } from "@/infrastructure/presenters/journal.presenter";
import { Journal } from "@/domain/models/journal.interface";
import { revalidatePath } from "next/cache";

// GET
export async function getJournalsByUserIdAction(userId: string) {
  try {
    const { data, error } =
      await journalContainer.journalUseCase.getJournalsByUserId(userId);

    if (error) {
      console.error("Error in getJournalsByUserIdAction:", error);
      return { data: [], error: error.message };
    }

    const presentedData = JournalPresenter.toPresentationList(data);
    return { data: presentedData, error: null };
  } catch (error) {
    console.error("Unexpected error in getJournalsByUserIdAction:", error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// GET BY ID
export async function getJournalByIdAction(id: string) {
  try {
    const { data, error } =
      await journalContainer.journalUseCase.getJournalById(id);

    if (error) {
      console.error("Error in getJournalByIdAction:", error);
      return { data: null, error: error.message };
    }

    const presentedData = data ? JournalPresenter.toPresentation(data) : null;
    return { data: presentedData, error: null };
  } catch (error) {
    console.error("Unexpected error in getJournalByIdAction:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createJournalAction(
  journalData: Omit<Journal, "id" | "createdAt" | "habits"> & {
    habitIds?: string[];
  }
) {
  try {
    // Add empty habits array to satisfy type constraint
    const journalWithHabits = {
      ...journalData,
      habits: [],
    };

    const { data, error } = await journalContainer.journalUseCase.createJournal(
      journalWithHabits
    );

    if (error) {
      console.error("Error in createJournalAction:", error);
      return { data: null, error: error.message };
    }

    const presentedData = data ? JournalPresenter.toPresentation(data) : null;

    // Revalidate the dashboard page to update the journal list
    revalidatePath("/dashboard");

    return { data: presentedData, error: null };
  } catch (error) {
    console.error("Unexpected error in createJournalAction:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateJournalAction(
  id: string,
  journalData: Partial<
    Omit<Journal, "id" | "userId" | "createdAt" | "habits">
  > & { habitIds?: string[] }
) {
  try {
    const { data, error } = await journalContainer.journalUseCase.updateJournal(
      id,
      journalData
    );

    if (error) {
      console.error("Error in updateJournalAction:", error);
      return { data: null, error: error.message };
    }

    const presentedData = data ? JournalPresenter.toPresentation(data) : null;

    // Revalidate the dashboard page to update the journal list
    revalidatePath("/dashboard");

    return { data: presentedData, error: null };
  } catch (error) {
    console.error("Unexpected error in updateJournalAction:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteJournalAction(id: string) {
  console.log("deleteJournalAction called with ID:", id);
  try {
    const { success, error } =
      await journalContainer.journalUseCase.deleteJournal(id);

    console.log("deleteJournal useCase result:", { success, error });

    if (error) {
      console.error("Error in deleteJournalAction:", error);
      return { success: false, error: error.message };
    }

    // Revalidate the dashboard page to update the journal list
    revalidatePath("/dashboard");
    console.log("Dashboard path revalidated after deletion");

    return { success, error: null };
  } catch (error) {
    console.error("Unexpected error in deleteJournalAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
