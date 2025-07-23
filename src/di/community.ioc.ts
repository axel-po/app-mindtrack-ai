import { FriendshipUseCase, FriendInvitationUseCase } from "@/domain/usecases/friendship.usecase";
import { createFriendshipRepository, createFriendInvitationRepository } from "@/infrastructure/repositories/friendship.repository";

class CommunityContainer {
  private static instance: CommunityContainer;
  private _friendshipUseCase: FriendshipUseCase | null = null;
  private _friendInvitationUseCase: FriendInvitationUseCase | null = null;

  private constructor() {}

  static getInstance(): CommunityContainer {
    if (!CommunityContainer.instance) {
      CommunityContainer.instance = new CommunityContainer();
    }
    return CommunityContainer.instance;
  }

  get friendshipUseCase(): FriendshipUseCase {
    if (!this._friendshipUseCase) {
      const friendshipRepository = createFriendshipRepository();
      const invitationRepository = createFriendInvitationRepository();
      this._friendshipUseCase = new FriendshipUseCase(friendshipRepository, invitationRepository);
    }
    return this._friendshipUseCase;
  }

  get friendInvitationUseCase(): FriendInvitationUseCase {
    if (!this._friendInvitationUseCase) {
      const invitationRepository = createFriendInvitationRepository();
      this._friendInvitationUseCase = new FriendInvitationUseCase(invitationRepository);
    }
    return this._friendInvitationUseCase;
  }
}

export const communityContainer = CommunityContainer.getInstance();