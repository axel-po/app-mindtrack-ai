"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/userinterface/components/ui/tabs";
import { FriendsOverview } from "./FriendsOverview";
import { InviteFriends } from "./InviteFriends";
import { FriendRequests } from "./FriendRequests";
import { FriendsComparison } from "./FriendsComparison";
import { Users, UserPlus, Inbox, TrendingUp } from "lucide-react";

interface CommunityDashboardProps {
  userId: string;
}

export function CommunityDashboard({ userId }: CommunityDashboardProps) {
  const [activeTab, setActiveTab] = useState("friends");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Amis
          </TabsTrigger>
          <TabsTrigger value="invite" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Inviter
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Demandes
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progrès
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-6">
          <FriendsOverview userId={userId} />
        </TabsContent>

        <TabsContent value="invite" className="space-y-6">
          <InviteFriends userId={userId} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <FriendRequests userId={userId} />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <FriendsComparison userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}