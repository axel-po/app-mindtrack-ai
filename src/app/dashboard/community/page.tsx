import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CommunityDashboard } from "@/userinterface/components/community/CommunityDashboard";

export default async function CommunityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Communauté
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Connectez-vous avec vos amis et suivez votre progression ensemble
        </p>
      </div>

      <CommunityDashboard userId={session.user.id} />
    </div>
  );
}
