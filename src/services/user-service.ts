"use server";

import {
  getUserById,
  searchUsers,
  getAllUsers,
} from "@/data/repositories/user-repository";
import { getHabitsByUserId } from "@/data/repositories/habit-repository";
import { UserModel } from "@/data/models/user-model";
import { Habit } from "@/data/models/habits-model";

export type UserWithHabits = {
  user: UserModel;
  habits: Habit[];
};

export async function searchUsersService(searchTerm: string) {
  return searchUsers(searchTerm);
}

export async function getUserWithHabits(
  userId: string
): Promise<UserWithHabits | null> {
  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  const habits = await getHabitsByUserId(userId);

  return {
    user,
    habits,
  };
}

export async function getRecentUsers(limit: number = 10) {
  return getAllUsers(limit);
}
