"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { Button } from "@/userinterface/components/ui/button";
import { Badge } from "@/userinterface/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/userinterface/components/ui/avatar";
import { Check, X } from "lucide-react";
import { FriendWithUser } from "@/domain/models/friendship.interface";
import { 
  getPendingRequests, 
  acceptFriendRequest, 
  declineFriendRequest 
} from "@/userinterface/actions/friendship.actions";

interface FriendRequestsProps {
  userId: string;
}

export function FriendRequests({ userId }: FriendRequestsProps) {
  const [requests, setRequests] = useState<FriendWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getPendingRequests(userId);
      if (result.success && result.data) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error("Error loading friend requests:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      setProcessingRequest(friendshipId);
      const result = await acceptFriendRequest(friendshipId, userId);
      if (result.success) {
        loadRequests();
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      setProcessingRequest(friendshipId);
      const result = await declineFriendRequest(friendshipId, userId);
      if (result.success) {
        loadRequests();
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      setProcessingRequest(null);
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
            <span>Demandes d&apos;amitié</span>
            <Badge variant="secondary">{requests.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Aucune demande d&apos;amitié en attente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(({ friendship, friend }) => (
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
                      <p className="text-xs text-gray-400">
                        Envoyé le {new Date(friendship.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcceptRequest(friendship.id)}
                      disabled={processingRequest === friendship.id}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      {processingRequest === friendship.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeclineRequest(friendship.id)}
                      disabled={processingRequest === friendship.id}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {processingRequest === friendship.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
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