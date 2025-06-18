"use server";

import { searchUsersService, getUserWithHabits } from "@/services/user-service";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth-server";

export async function searchUsers(searchTerm: string) {
  try {
    const users = await searchUsersService(searchTerm);
    return { success: true, data: users };
  } catch (error) {
    console.error("Error searching users:", error);
    return {
      success: false,
      error: "Impossible de rechercher des utilisateurs",
    };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const userWithHabits = await getUserWithHabits(userId);

    if (!userWithHabits) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    return { success: true, data: userWithHabits };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      error: "Impossible de récupérer le profil utilisateur",
    };
  }
}

export async function refreshCommunityData() {
  revalidatePath("/dashboard/community");
}

export async function sendInvitation(emails: string[], message: string) {
  try {
    const currentUser = await getUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Vous devez être connecté pour inviter des amis",
      };
    }

    // This would typically connect to an email service
    // For now, we'll just log the invitation details
    console.log("Sending invitations:", {
      from: currentUser.email,
      to: emails,
      message,
      invitedBy: currentUser.name,
    });

    // In a real implementation, you would:
    // 1. Connect to an email service API
    // 2. Send emails to each recipient
    // 3. Store invitation records in the database
    // 4. Handle email sending failures

    // For now, we'll simulate success
    return {
      success: true,
      message: `${emails.length} invitation(s) envoyée(s) avec succès`,
    };
  } catch (error) {
    console.error("Error sending invitations:", error);
    return {
      success: false,
      error: "Impossible d'envoyer les invitations",
    };
  }
}
