import { 
  friendships, 
  friendInvitations,
  type Friendship as FriendshipSchema,
  type FriendInvitation as FriendInvitationSchema 
} from "@/infrastructure/database/schemas/friendships.schema";
import { UserModel } from "@/infrastructure/database/schemas/user.schema";
import { Habit } from "./habit.interface";

export type Friendship = typeof friendships.$inferSelect;
export type FriendInvitation = typeof friendInvitations.$inferSelect;

export interface FriendWithUser {
  friendship: Friendship;
  friend: UserModel;
}

export interface FriendHabitStats {
  friend: UserModel;
  habits: Habit[];
  completedHabitsToday: number;
  totalHabits: number;
  completionRate: number;
  streak: number;
}

export interface FriendshipRepository {
  getFriendships(userId: string): Promise<{ data: FriendWithUser[]; error?: Error }>;
  
  getPendingFriendRequests(userId: string): Promise<{ data: FriendWithUser[]; error?: Error }>;
  
  sendFriendRequest(requesterId: string, addresseeId: string): Promise<{ data: Friendship | null; error?: Error }>;
  
  acceptFriendRequest(friendshipId: string, userId: string): Promise<{ success: boolean; error?: Error }>;
  
  declineFriendRequest(friendshipId: string, userId: string): Promise<{ success: boolean; error?: Error }>;
  
  removeFriend(friendshipId: string, userId: string): Promise<{ success: boolean; error?: Error }>;
  
  blockUser(friendshipId: string, userId: string): Promise<{ success: boolean; error?: Error }>;
  
  getFriendHabitStats(userId: string, friendId: string): Promise<{ data: FriendHabitStats | null; error?: Error }>;
  
  getAllFriendsHabitStats(userId: string): Promise<{ data: FriendHabitStats[]; error?: Error }>;
}

export interface FriendInvitationRepository {
  createInvitation(inviterId: string, email: string): Promise<{ data: FriendInvitation | null; error?: Error }>;
  
  getInvitationByToken(token: string): Promise<{ data: FriendInvitation | null; error?: Error }>;
  
  acceptInvitation(token: string, userId: string): Promise<{ success: boolean; error?: Error }>;
  
  getInvitationsByUser(userId: string): Promise<{ data: FriendInvitation[]; error?: Error }>;
  
  deleteInvitation(id: string): Promise<{ success: boolean; error?: Error }>;
}