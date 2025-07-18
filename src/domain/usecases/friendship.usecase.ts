import { 
  FriendshipRepository, 
  FriendInvitationRepository,
  FriendWithUser,
  FriendHabitStats,
  Friendship,
  FriendInvitation 
} from "@/domain/models/friendship.interface";
import { FriendshipEntity, FriendInvitationEntity } from "@/domain/entities/friendship.entity";

export class FriendshipUseCase {
  constructor(
    private friendshipRepository: FriendshipRepository,
    private invitationRepository: FriendInvitationRepository
  ) {}

  async getFriends(userId: string): Promise<{ data: FriendWithUser[]; error?: Error }> {
    try {
      const result = await this.friendshipRepository.getFriendships(userId);
      return result;
    } catch (error) {
      console.error("Error in getFriends usecase:", error);
      return { data: [], error: error as Error };
    }
  }

  async getPendingRequests(userId: string): Promise<{ data: FriendWithUser[]; error?: Error }> {
    try {
      const result = await this.friendshipRepository.getPendingFriendRequests(userId);
      return result;
    } catch (error) {
      console.error("Error in getPendingRequests usecase:", error);
      return { data: [], error: error as Error };
    }
  }

  async sendFriendRequest(requesterId: string, addresseeId: string): Promise<{ data: Friendship | null; error?: Error }> {
    try {
      if (requesterId === addresseeId) {
        return { data: null, error: new Error("Cannot send friend request to yourself") };
      }

      const result = await this.friendshipRepository.sendFriendRequest(requesterId, addresseeId);
      return result;
    } catch (error) {
      console.error("Error in sendFriendRequest usecase:", error);
      return { data: null, error: error as Error };
    }
  }

  async acceptFriendRequest(friendshipId: string, userId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      const result = await this.friendshipRepository.acceptFriendRequest(friendshipId, userId);
      return result;
    } catch (error) {
      console.error("Error in acceptFriendRequest usecase:", error);
      return { success: false, error: error as Error };
    }
  }

  async declineFriendRequest(friendshipId: string, userId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      const result = await this.friendshipRepository.declineFriendRequest(friendshipId, userId);
      return result;
    } catch (error) {
      console.error("Error in declineFriendRequest usecase:", error);
      return { success: false, error: error as Error };
    }
  }

  async removeFriend(friendshipId: string, userId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      const result = await this.friendshipRepository.removeFriend(friendshipId, userId);
      return result;
    } catch (error) {
      console.error("Error in removeFriend usecase:", error);
      return { success: false, error: error as Error };
    }
  }

  async blockUser(friendshipId: string, userId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      const result = await this.friendshipRepository.blockUser(friendshipId, userId);
      return result;
    } catch (error) {
      console.error("Error in blockUser usecase:", error);
      return { success: false, error: error as Error };
    }
  }

  async getFriendHabitStats(userId: string, friendId: string): Promise<{ data: FriendHabitStats | null; error?: Error }> {
    try {
      const result = await this.friendshipRepository.getFriendHabitStats(userId, friendId);
      return result;
    } catch (error) {
      console.error("Error in getFriendHabitStats usecase:", error);
      return { data: null, error: error as Error };
    }
  }

  async getAllFriendsHabitStats(userId: string): Promise<{ data: FriendHabitStats[]; error?: Error }> {
    try {
      const result = await this.friendshipRepository.getAllFriendsHabitStats(userId);
      return result;
    } catch (error) {
      console.error("Error in getAllFriendsHabitStats usecase:", error);
      return { data: [], error: error as Error };
    }
  }
}

export class FriendInvitationUseCase {
  constructor(private invitationRepository: FriendInvitationRepository) {}

  async inviteFriend(inviterId: string, email: string): Promise<{ data: FriendInvitation | null; error?: Error }> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { data: null, error: new Error("Invalid email format") };
      }

      const result = await this.invitationRepository.createInvitation(inviterId, email);
      return result;
    } catch (error) {
      console.error("Error in inviteFriend usecase:", error);
      return { data: null, error: error as Error };
    }
  }

  async acceptInvitation(token: string, userId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      // Validate token first
      const invitationResult = await this.invitationRepository.getInvitationByToken(token);
      if (invitationResult.error || !invitationResult.data) {
        return { success: false, error: new Error("Invalid invitation token") };
      }

      const invitation = new FriendInvitationEntity(
        invitationResult.data.id,
        invitationResult.data.inviterId,
        invitationResult.data.inviteeEmail,
        invitationResult.data.token,
        invitationResult.data.expiresAt,
        invitationResult.data.createdAt
      );

      if (!invitation.isValid()) {
        return { success: false, error: new Error("Invitation has expired") };
      }

      const result = await this.invitationRepository.acceptInvitation(token, userId);
      return result;
    } catch (error) {
      console.error("Error in acceptInvitation usecase:", error);
      return { success: false, error: error as Error };
    }
  }

  async getUserInvitations(userId: string): Promise<{ data: FriendInvitation[]; error?: Error }> {
    try {
      const result = await this.invitationRepository.getInvitationsByUser(userId);
      return result;
    } catch (error) {
      console.error("Error in getUserInvitations usecase:", error);
      return { data: [], error: error as Error };
    }
  }
}