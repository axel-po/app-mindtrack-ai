import { Suspense } from "react";
import { getRecentUsers } from "@/services/user-service";
import { UserSearch } from "./_components/user-search";
import { RecentUsers } from "./_components/recent-users";
import { SearchResults } from "./_components/search-results";
import { InviteFriendsDialog } from "./_components/invite-friends-dialog";

export const metadata = {
  title: "Communauté | MindTrack",
  description:
    "Connectez-vous avec d'autres utilisateurs et suivez leur progression",
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const recentUsers = await getRecentUsers(8);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Communauté</h1>
          <p className="text-muted-foreground">
            Recherchez d&apos;autres utilisateurs et suivez leur progression
          </p>
        </div>
        <InviteFriendsDialog />
      </div>

      <div className="w-full max-w-2xl">
        <UserSearch />
      </div>

      <div className="grid gap-6">
        {query ? (
          <Suspense fallback={<div>Recherche en cours...</div>}>
            <SearchResults query={query} />
          </Suspense>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Utilisateurs récents</h2>
            <RecentUsers users={recentUsers} />
          </div>
        )}
      </div>
    </div>
  );
}
