export type FriendshipStatus = "pending" | "accepted" | "declined" | "blocked";

export class FriendshipEntity {
  constructor(
    public readonly id: string,
    public readonly requesterId: string,
    public readonly addresseeId: string,
    public readonly status: FriendshipStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  isAccepted(): boolean {
    return this.status === "accepted";
  }

  isPending(): boolean {
    return this.status === "pending";
  }

  isBlocked(): boolean {
    return this.status === "blocked";
  }

  canViewFriendHabits(): boolean {
    return this.isAccepted();
  }

  getFriendId(currentUserId: string): string {
    return this.requesterId === currentUserId ? this.addresseeId : this.requesterId;
  }

  isUserRequester(userId: string): boolean {
    return this.requesterId === userId;
  }

  canBeAccepted(userId: string): boolean {
    return this.isPending() && this.addresseeId === userId;
  }

  canBeDeclined(userId: string): boolean {
    return this.isPending() && this.addresseeId === userId;
  }
}

export class FriendInvitationEntity {
  constructor(
    public readonly id: string,
    public readonly inviterId: string,
    public readonly inviteeEmail: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isExpired();
  }
}