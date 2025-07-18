import db from "@/infrastructure/database/client";
import { friendships, friendInvitations } from "@/infrastructure/database/schemas/friendships.schema";
import { user } from "@/infrastructure/database/schemas/user.schema";
import { habits } from "@/infrastructure/database/schemas/habits.schema";
import { entries } from "@/infrastructure/database/schemas/entries.schema";
import { entryHabits } from "@/infrastructure/database/schemas/entryHabits.schema";
import { eq, and, or, count, sql } from "drizzle-orm";
import { 
  FriendshipRepository, 
  FriendInvitationRepository,
  FriendHabitStats
} from "@/domain/models/friendship.interface";

export function createFriendshipRepository(): FriendshipRepository {
  return {
    async getFriendships(userId: string) {
      try {
        const friendsData = await db
          .select({
            friendship: friendships,
            friend: user,
          })
          .from(friendships)
          .innerJoin(
            user,
            or(
              and(eq(friendships.requesterId, userId), eq(user.id, friendships.addresseeId)),
              and(eq(friendships.addresseeId, userId), eq(user.id, friendships.requesterId))
            )
          )
          .where(eq(friendships.status, "accepted"));

        return { data: friendsData };
      } catch (error) {
        console.error("Error in getFriendships repository:", error);
        return { data: [], error: error as Error };
      }
    },

    async getPendingFriendRequests(userId: string) {
      try {
        const pendingRequests = await db
          .select({
            friendship: friendships,
            friend: user,
          })
          .from(friendships)
          .innerJoin(user, eq(user.id, friendships.requesterId))
          .where(
            and(
              eq(friendships.addresseeId, userId),
              eq(friendships.status, "pending")
            )
          );

        return { data: pendingRequests };
      } catch (error) {
        console.error("Error in getPendingFriendRequests repository:", error);
        return { data: [], error: error as Error };
      }
    },

    async sendFriendRequest(requesterId: string, addresseeId: string) {
      try {
        // Check if friendship already exists
        const existingFriendship = await db
          .select()
          .from(friendships)
          .where(
            or(
              and(
                eq(friendships.requesterId, requesterId),
                eq(friendships.addresseeId, addresseeId)
              ),
              and(
                eq(friendships.requesterId, addresseeId),
                eq(friendships.addresseeId, requesterId)
              )
            )
          )
          .limit(1);

        if (existingFriendship.length > 0) {
          return { data: null, error: new Error("Friendship already exists") };
        }

        const [newFriendship] = await db
          .insert(friendships)
          .values({
            requesterId,
            addresseeId,
            status: "pending",
          })
          .returning();

        return { data: newFriendship };
      } catch (error) {
        console.error("Error in sendFriendRequest repository:", error);
        return { data: null, error: error as Error };
      }
    },

    async acceptFriendRequest(friendshipId: string, userId: string) {
      try {
        const [updatedFriendship] = await db
          .update(friendships)
          .set({
            status: "accepted",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(friendships.id, friendshipId),
              eq(friendships.addresseeId, userId)
            )
          )
          .returning();

        if (!updatedFriendship) {
          return { success: false, error: new Error("Friendship not found or not authorized") };
        }

        return { success: true };
      } catch (error) {
        console.error("Error in acceptFriendRequest repository:", error);
        return { success: false, error: error as Error };
      }
    },

    async declineFriendRequest(friendshipId: string, userId: string) {
      try {
        const [updatedFriendship] = await db
          .update(friendships)
          .set({
            status: "declined",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(friendships.id, friendshipId),
              eq(friendships.addresseeId, userId)
            )
          )
          .returning();

        if (!updatedFriendship) {
          return { success: false, error: new Error("Friendship not found or not authorized") };
        }

        return { success: true };
      } catch (error) {
        console.error("Error in declineFriendRequest repository:", error);
        return { success: false, error: error as Error };
      }
    },

    async removeFriend(friendshipId: string, userId: string) {
      try {
        const deletedFriendship = await db
          .delete(friendships)
          .where(
            and(
              eq(friendships.id, friendshipId),
              or(
                eq(friendships.requesterId, userId),
                eq(friendships.addresseeId, userId)
              )
            )
          )
          .returning();

        if (deletedFriendship.length === 0) {
          return { success: false, error: new Error("Friendship not found or not authorized") };
        }

        return { success: true };
      } catch (error) {
        console.error("Error in removeFriend repository:", error);
        return { success: false, error: error as Error };
      }
    },

    async blockUser(friendshipId: string, userId: string) {
      try {
        const [updatedFriendship] = await db
          .update(friendships)
          .set({
            status: "blocked",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(friendships.id, friendshipId),
              or(
                eq(friendships.requesterId, userId),
                eq(friendships.addresseeId, userId)
              )
            )
          )
          .returning();

        if (!updatedFriendship) {
          return { success: false, error: new Error("Friendship not found or not authorized") };
        }

        return { success: true };
      } catch (error) {
        console.error("Error in blockUser repository:", error);
        return { success: false, error: error as Error };
      }
    },

    async getFriendHabitStats(userId: string, friendId: string) {
      try {
        // Check if users are friends
        const friendship = await db
          .select()
          .from(friendships)
          .where(
            and(
              or(
                and(eq(friendships.requesterId, userId), eq(friendships.addresseeId, friendId)),
                and(eq(friendships.requesterId, friendId), eq(friendships.addresseeId, userId))
              ),
              eq(friendships.status, "accepted")
            )
          )
          .limit(1);

        if (friendship.length === 0) {
          return { data: null, error: new Error("Users are not friends") };
        }

        // Get friend's profile
        const [friendProfile] = await db
          .select()
          .from(user)
          .where(eq(user.id, friendId))
          .limit(1);

        if (!friendProfile) {
          return { data: null, error: new Error("Friend not found") };
        }

        // Get friend's habits
        const friendHabits = await db
          .select()
          .from(habits)
          .where(eq(habits.userId, friendId));

        // Get today's completed habits
        const today = new Date().toISOString().split("T")[0];
        const todayCompletedHabits = await db
          .select({ count: count() })
          .from(entryHabits)
          .innerJoin(entries, eq(entries.id, entryHabits.entryId))
          .where(
            and(
              eq(entries.userId, friendId),
              eq(entries.date, today)
            )
          );

        const completedHabitsToday = todayCompletedHabits[0]?.count || 0;
        const totalHabits = friendHabits.length;
        const completionRate = totalHabits > 0 ? (completedHabitsToday / totalHabits) * 100 : 0;

        // Calculate streak (simplified - count consecutive days with any habit completion)
        const streakQuery = await db
          .select({ date: entries.date })
          .from(entries)
          .innerJoin(entryHabits, eq(entryHabits.entryId, entries.id))
          .where(eq(entries.userId, friendId))
          .groupBy(entries.date)
          .orderBy(sql`${entries.date} DESC`)
          .limit(30);

        let streak = 0;
        const dates = streakQuery.map(row => row.date);
        for (let i = 0; i < dates.length; i++) {
          const expectedDate = new Date();
          expectedDate.setDate(expectedDate.getDate() - i);
          const expectedDateStr = expectedDate.toISOString().split("T")[0];
          
          if (dates[i] === expectedDateStr) {
            streak++;
          } else {
            break;
          }
        }

        const habitStats: FriendHabitStats = {
          friend: friendProfile,
          habits: friendHabits,
          completedHabitsToday,
          totalHabits,
          completionRate,
          streak,
        };

        return { data: habitStats };
      } catch (error) {
        console.error("Error in getFriendHabitStats repository:", error);
        return { data: null, error: error as Error };
      }
    },

    async getAllFriendsHabitStats(userId: string) {
      try {
        // Get all friends
        const friends = await db
          .select({
            friendship: friendships,
            friend: user,
          })
          .from(friendships)
          .innerJoin(
            user,
            or(
              and(eq(friendships.requesterId, userId), eq(user.id, friendships.addresseeId)),
              and(eq(friendships.addresseeId, userId), eq(user.id, friendships.requesterId))
            )
          )
          .where(eq(friendships.status, "accepted"));

        const friendsStats: FriendHabitStats[] = [];

        for (const { friend } of friends) {
          const stats = await this.getFriendHabitStats(userId, friend.id);
          if (stats.data) {
            friendsStats.push(stats.data);
          }
        }

        return { data: friendsStats };
      } catch (error) {
        console.error("Error in getAllFriendsHabitStats repository:", error);
        return { data: [], error: error as Error };
      }
    },
  };
}

export function createFriendInvitationRepository(): FriendInvitationRepository {
  return {
    async createInvitation(inviterId: string, email: string) {
      try {
        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

        const [newInvitation] = await db
          .insert(friendInvitations)
          .values({
            inviterId,
            inviteeEmail: email,
            token,
            expiresAt,
          })
          .returning();

        return { data: newInvitation };
      } catch (error) {
        console.error("Error in createInvitation repository:", error);
        return { data: null, error: error as Error };
      }
    },

    async getInvitationByToken(token: string) {
      try {
        const [invitation] = await db
          .select()
          .from(friendInvitations)
          .where(eq(friendInvitations.token, token))
          .limit(1);

        return { data: invitation || null };
      } catch (error) {
        console.error("Error in getInvitationByToken repository:", error);
        return { data: null, error: error as Error };
      }
    },

    async acceptInvitation(token: string, userId: string) {
      try {
        const [invitation] = await db
          .select()
          .from(friendInvitations)
          .where(eq(friendInvitations.token, token))
          .limit(1);

        if (!invitation) {
          return { success: false, error: new Error("Invitation not found") };
        }

        // Create friendship
        await db.insert(friendships).values({
          requesterId: invitation.inviterId,
          addresseeId: userId,
          status: "accepted",
        });

        // Delete invitation
        await db
          .delete(friendInvitations)
          .where(eq(friendInvitations.id, invitation.id));

        return { success: true };
      } catch (error) {
        console.error("Error in acceptInvitation repository:", error);
        return { success: false, error: error as Error };
      }
    },

    async getInvitationsByUser(userId: string) {
      try {
        const invitations = await db
          .select()
          .from(friendInvitations)
          .where(eq(friendInvitations.inviterId, userId));

        return { data: invitations };
      } catch (error) {
        console.error("Error in getInvitationsByUser repository:", error);
        return { data: [], error: error as Error };
      }
    },

    async deleteInvitation(id: string) {
      try {
        await db
          .delete(friendInvitations)
          .where(eq(friendInvitations.id, id));

        return { success: true };
      } catch (error) {
        console.error("Error in deleteInvitation repository:", error);
        return { success: false, error: error as Error };
      }
    },
  };
}