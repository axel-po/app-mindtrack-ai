import React, { Suspense } from "react";
import Link from "next/link";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { getUser } from "@/lib/auth-server";
import { Skeleton } from "../../ui/skeleton";
import { LogOut } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ToggleTheme } from "../theme/toggle-theme";

export function Header() {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="flex items-center">
        <Link href="/" className="font-semibold text-xl flex items-center">
          MindTrack AI
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ToggleTheme />
        <Suspense fallback={<Skeleton className="w-10 h-10 rounded-full" />}>
          <AuthButton />
        </Suspense>
      </div>
    </header>
  );
}

export const AuthButton = async () => {
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button>
          <Link href="/login">Se connecter</Link>
        </Button>

        <Button variant="outline">
          <Link href="/register">S&apos;inscrire</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Avatar className="size-6">
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <p>{user.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <form>
            <button
              formAction={async () => {
                "use server";

                await auth.api.signOut({
                  headers: await headers(),
                });

                redirect("/login");
              }}
            >
              <LogOut className="size-4 mr-2" />
              Se déconnecter
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
