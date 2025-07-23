"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { Progress } from "@/userinterface/components/ui/progress";
import { Badge } from "@/userinterface/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/userinterface/components/ui/avatar";
import { Trophy, Target, TrendingUp, Calendar } from "lucide-react";
import { FriendHabitStats } from "@/domain/models/friendship.interface";
import { getAllFriendsHabitStats } from "@/userinterface/actions/friendship.actions";

interface FriendsComparisonProps {
  userId: string;
}

export function FriendsComparison({ userId }: FriendsComparisonProps) {
  const [friendsStats, setFriendsStats] = useState<FriendHabitStats[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFriendsStats = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading friends stats for user:", userId);
      const result = await getAllFriendsHabitStats(userId);
      console.log("Friends stats result:", result);
      
      if (result.success && result.data) {
        setFriendsStats(result.data.sort((a, b) => b.completionRate - a.completionRate));
        console.log("Friends stats loaded:", result.data);
      } else {
        console.error("Failed to load friends stats:", result.error);
      }
    } catch (error) {
      console.error("Error loading friends stats:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadFriendsStats();
  }, [userId, loadFriendsStats]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStreakBadgeColor = (streak: number) => {
    if (streak >= 7) return "bg-green-100 text-green-800";
    if (streak >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Classement des amis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friendsStats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Aucun ami à comparer pour le moment. Ajoutez des amis pour voir leurs progrès !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {friendsStats.map((friendStats, index) => (
                <div
                  key={friendStats.friend.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    index === 0 ? "border-yellow-200 bg-yellow-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      )}
                      <span className="font-bold text-lg text-gray-400">
                        #{index + 1}
                      </span>
                    </div>
                    <Avatar>
                      <AvatarImage src={friendStats.friend.image || undefined} />
                      <AvatarFallback>
                        {getInitials(friendStats.friend.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friendStats.friend.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={getStreakBadgeColor(friendStats.streak)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Série de {friendStats.streak} jours
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {friendStats.totalHabits} habitudes
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getCompletionRateColor(friendStats.completionRate)}`}>
                      {friendStats.completionRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {friendStats.completedHabitsToday}/{friendStats.totalHabits} aujourd&apos;hui
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {friendsStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5" />
                Progrès d&apos;aujourd&apos;hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {friendsStats.map((friendStats) => (
                  <div key={friendStats.friend.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {friendStats.friend.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {friendStats.completedHabitsToday}/{friendStats.totalHabits}
                      </span>
                    </div>
                    <Progress 
                      value={friendStats.completionRate} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Leaders des séries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {friendsStats
                  .sort((a, b) => b.streak - a.streak)
                  .slice(0, 5)
                  .map((friendStats) => (
                    <div key={friendStats.friend.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={friendStats.friend.image || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(friendStats.friend.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {friendStats.friend.name}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={getStreakBadgeColor(friendStats.streak)}
                      >
                        {friendStats.streak} jours
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}