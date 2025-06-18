import Link from "next/link";
import { UserModel } from "@/data/models/user-model";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RecentUsers({ users }: { users: UserModel[] }) {
  if (users.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          Aucun utilisateur récent à afficher
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
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
