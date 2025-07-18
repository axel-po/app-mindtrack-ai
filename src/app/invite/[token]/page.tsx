import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InvitationAcceptance } from "@/userinterface/components/community/InvitationAcceptance";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <InvitationAcceptance token={token} userId={session.user.id} />
      </div>
    </div>
  );
}