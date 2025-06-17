import { getUser } from "@/lib/auth-server";
import { NavUser } from "./nav-user";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function NavUserWrapper() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const handleSignOut = async () => {
    "use server";

    await auth.api.signOut({
      headers: await headers(),
    });

    redirect("/login");
  };

  return (
    <NavUser
      user={{
        name: user.name || "Utilisateur",
        email: user.email,
        avatar: user.image || "",
      }}
      onSignOut={handleSignOut}
    />
  );
}
