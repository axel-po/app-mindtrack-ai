"use server";

import { NewEntry } from "@/data/models/entries-model";
import {
  createEntry,
  getEntriesByUserId,
  getEntryById,
  addHabitsToEntry,
  getEntryWithHabits,
  removeHabitFromEntry,
  getEntriesWithHabitsByUserId,
  updateEntry,
  deleteEntry,
} from "@/data/repositories/journal-entries-repository";

export async function addJournalEntry(input: NewEntry, habitIds?: string[]) {
  const entry = await createEntry(input);

  if (habitIds?.length) {
    await addHabitsToEntry(entry.id, habitIds);
  }

  return entry;
}

export async function getUserJournalEntries(userId: string) {
  return getEntriesByUserId(userId);
}

export async function getJournalEntryDetails(id: string) {
  const entry = await getEntryById(id);

  if (!entry) {
    throw new Error(`Journal entry with id ${id} not found`);
  }

  return entry;
}

export async function getJournalEntryWithHabits(id: string) {
  const entry = await getEntryWithHabits(id);

  if (!entry) {
    throw new Error(`Journal entry with id ${id} not found`);
  }

  return entry;
}

export async function toggleHabitCompletion(
  entryId: string,
  habitId: string,
  completed: boolean
) {
  if (completed) {
    return addHabitsToEntry(entryId, [habitId]);
  } else {
    return removeHabitFromEntry(entryId, habitId);
  }
}

export async function getEntriesByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  const entries = await getEntriesByUserId(userId);

  return entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= endDate;
  });
}

export async function getUserJournalEntriesWithHabits(userId: string) {
  return getEntriesWithHabitsByUserId(userId);
}

export async function updateJournalEntry(id: string, data: Partial<NewEntry>) {
  const entry = await getEntryById(id);

  if (!entry) {
    throw new Error(`Journal entry with id ${id} not found`);
  }

  return updateEntry(id, data);
}

export async function deleteJournalEntry(id: string) {
  const entry = await getEntryById(id);

  if (!entry) {
    throw new Error(`Journal entry with id ${id} not found`);
  }

  return deleteEntry(id);
}
