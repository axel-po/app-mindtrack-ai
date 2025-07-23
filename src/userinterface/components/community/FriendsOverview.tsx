"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { Badge } from "@/userinterface/components/ui/badge";
import { Button } from "@/userinterface/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/userinterface/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/userinterface/components/ui/dropdown-menu";
import { MoreVertical, MessageSquare, UserMinus, UserX } from "lucide-react";
import { FriendWithUser } from "@/domain/models/friendship.interface";
import { getFriends, removeFriend, blockUser } from "@/userinterface/actions/friendship.actions";

interface FriendsOverviewProps {
  userId: string;
}

export function FriendsOverview({ userId }: FriendsOverviewProps) {
  const [friends, setFriends] = useState<FriendWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();
  }, [userId]);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const result = await getFriends(userId);
      if (result.success && result.data) {
        setFriends(result.data);
      }
    } catch (error) {
      console.error("Error loading friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      const result = await removeFriend(friendshipId, userId);
      if (result.success) {
        loadFriends();
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleBlockUser = async (friendshipId: string) => {
    try {
      const result = await blockUser(friendshipId, userId);
      if (result.success) {
        loadFriends();
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vos amis</span>
            <Badge variant="secondary">{friends.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Aucun ami pour le moment. Commencez par inviter des amis à vous rejoindre !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {friends.map(({ friendship, friend }) => (
                <div
                  key={friendship.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={friend.image || undefined} />
                      <AvatarFallback>{getInitials(friend.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {friend.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      Amis
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Envoyer un message
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemoveFriend(friendship.id)}
                          className="text-orange-600"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Supprimer l'ami
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBlockUser(friendship.id)}
                          className="text-red-600"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Bloquer l'utilisateur
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}