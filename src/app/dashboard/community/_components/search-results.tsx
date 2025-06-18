import Link from "next/link";
import { searchUsersService } from "@/services/user-service";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserModel } from "@/data/models/user-model";

export async function SearchResults({ query }: { query: string }) {
  const users = await searchUsersService(query);

  if (users.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Aucun utilisateur trouvé</h3>
        <p className="text-muted-foreground mt-1">
          Essayez avec un autre terme de recherche
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Résultats de recherche</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user: UserModel) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user }: { user: UserModel }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <div className="bg-primary/10 h-full w-full flex items-center justify-center rounded-full">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{user.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <div className="mt-4">
        <Link href={`/dashboard/community/profile/${user.id}`} passHref>
          <Button variant="outline" className="w-full">
            Voir le profil
          </Button>
        </Link>
      </div>
    </Card>
  );
}
