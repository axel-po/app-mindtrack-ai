"use server";

import { createFriendshipRepository, createFriendInvitationRepository } from "@/infrastructure/repositories/friendship.repository";
import { FriendshipUseCase, FriendInvitationUseCase } from "@/domain/usecases/friendship.usecase";

const friendshipRepository = createFriendshipRepository();
const invitationRepository = createFriendInvitationRepository();
const friendshipUseCase = new FriendshipUseCase(friendshipRepository, invitationRepository);
const invitationUseCase = new FriendInvitationUseCase(invitationRepository);

export async function getFriends(userId: string) {
  try {
    const result = await friendshipUseCase.getFriends(userId);
    return {
      success: !result.error,
      data: result.data,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      data: null,
      error: "Failed to get friends",
    };
  }
}

export async function getPendingRequests(userId: string) {
  try {
    const result = await friendshipUseCase.getPendingRequests(userId);
    return {
      success: !result.error,
      data: result.data,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      data: null,
      error: "Failed to get pending requests",
    };
  }
}

export async function sendFriendRequest(requesterId: string, addresseeId: string) {
  try {
    const result = await friendshipUseCase.sendFriendRequest(requesterId, addresseeId);
    return {
      success: !result.error,
      data: result.data,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      data: null,
      error: "Failed to send friend request",
    };
  }
}

export async function acceptFriendRequest(friendshipId: string, userId: string) {
  try {
    const result = await friendshipUseCase.acceptFriendRequest(friendshipId, userId);
    return {
      success: result.success,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      error: "Failed to accept friend request",
    };
  }
}

export async function declineFriendRequest(friendshipId: string, userId: string) {
  try {
    const result = await friendshipUseCase.declineFriendRequest(friendshipId, userId);
    return {
      success: result.success,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      error: "Failed to decline friend request",
    };
  }
}

export async function removeFriend(friendshipId: string, userId: string) {
  try {
    const result = await friendshipUseCase.removeFriend(friendshipId, userId);
    return {
      success: result.success,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      error: "Failed to remove friend",
    };
  }
}

export async function blockUser(friendshipId: string, userId: string) {
  try {
    const result = await friendshipUseCase.blockUser(friendshipId, userId);
    return {
      success: result.success,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      error: "Failed to block user",
    };
  }
}

export async function getFriendHabitStats(userId: string, friendId: string) {
  try {
    const result = await friendshipUseCase.getFriendHabitStats(userId, friendId);
    return {
      success: !result.error,
      data: result.data,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      data: null,
      error: "Failed to get friend habit stats",
    };
  }
}

export async function getAllFriendsHabitStats(userId: string) {
  try {
    const result = await friendshipUseCase.getAllFriendsHabitStats(userId);
    return {
      success: !result.error,
      data: result.data,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      data: null,
      error: "Failed to get friends habit stats",
    };
  }
}

export async function inviteFriend(inviterId: string, email: string) {
  try {
    const result = await invitationUseCase.inviteFriend(inviterId, email);
    return {
      success: !result.error,
      data: result.data,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      data: null,
      error: "Failed to invite friend",
    };
  }
}

export async function acceptInvitation(token: string, userId: string) {
  try {
    const result = await invitationUseCase.acceptInvitation(token, userId);
    return {
      success: result.success,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      error: "Failed to accept invitation",
    };
  }
}

export async function getUserInvitations(userId: string) {
  try {
    const result = await invitationUseCase.getUserInvitations(userId);
    return {
      success: !result.error,
      data: result.data,
      error: result.error?.message,
    };
  } catch {
    return {
      success: false,
      data: null,
      error: "Failed to get user invitations",
    };
  }
}