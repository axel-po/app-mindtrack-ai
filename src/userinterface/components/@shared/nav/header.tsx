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
import { LogOut, Sparkles, BrainCircuit } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ToggleTheme } from "../theme/toggle-theme";

export function Header() {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-indigo-500/10">
      <div className="relative flex items-center">
        <Link href="/" className="font-bold text-xl flex items-center group">
          <div className="relative mr-2">
            <BrainCircuit className="size-7 text-indigo-600 group-hover:text-indigo-500 transition-all duration-300" />
            <span className="absolute -top-1 -right-1 size-2 bg-indigo-500 rounded-full animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MindTrack AI
          </span>
          <Sparkles className="ml-1 size-4 text-amber-500 opacity-80" />
        </Link>

        {/* Glass pill navigation for desktop */}
        <nav className="hidden ml-12 md:flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
          <Link
            href="/features"
            className="text-sm font-medium px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
          >
            Fonctionnalités
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
          >
            Tarifs
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
          >
            À propos
          </Link>
        </nav>
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
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="text-sm font-medium hover:bg-white/10 hover:text-indigo-400 transition-colors"
        >
          <Link href="/login">Se connecter</Link>
        </Button>

        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-none rounded-full px-5 shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:scale-[1.02]">
          <Link href="/register">S&apos;inscrire</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-indigo-500/20 hover:border-indigo-500/40 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Avatar className="size-6 mr-2 ring-2 ring-indigo-500/20">
            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white"></AvatarFallback>
          </Avatar>
          <p>{user.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background/95 backdrop-blur-md border-indigo-500/20">
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
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-white/5 transition-colors"
            >
              <LogOut className="size-4 mr-2 text-indigo-500" />
              Se déconnecter
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
