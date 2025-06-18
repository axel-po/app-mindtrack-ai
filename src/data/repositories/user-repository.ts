"use server";

import db from "@/data/db/client";
import { user } from "@/data/models/user-model";
import { UserModel } from "@/data/models/user-model";
import { eq, like, or } from "drizzle-orm";

export async function searchUsers(searchTerm: string) {
  if (!searchTerm || searchTerm.trim() === "") {
    return [];
  }

  const searchPattern = `%${searchTerm}%`;

  return db
    .select()
    .from(user)
    .where(or(like(user.name, searchPattern), like(user.email, searchPattern)))
    .limit(20);
}

export async function getUserById(userId: string): Promise<UserModel | null> {
  const users = await db.select().from(user).where(eq(user.id, userId));

  return users.length > 0 ? users[0] : null;
}

export async function getAllUsers(limit: number = 10) {
  return db.select().from(user).limit(limit);
}
