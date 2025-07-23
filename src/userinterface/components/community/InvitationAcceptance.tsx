"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { Button } from "@/userinterface/components/ui/button";
import { Check, X, Users, AlertCircle } from "lucide-react";
import { acceptInvitation } from "@/userinterface/actions/friendship.actions";

interface InvitationAcceptanceProps {
  token: string;
  userId: string;
}

export function InvitationAcceptance({ token, userId }: InvitationAcceptanceProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAcceptInvitation = async () => {
    try {
      setLoading(true);
      const result = await acceptInvitation(token, userId);
      
      if (result.success) {
        setStatus("success");
        setMessage("Invitation acceptée avec succès ! Vous êtes maintenant amis.");
        setTimeout(() => {
          router.push("/dashboard/community");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(result.error || "Échec de l'acceptation de l'invitation");
      }
    } catch {
      setStatus("error");
      setMessage("Une erreur s'est produite lors de l'acceptation de l'invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    router.push("/dashboard");
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Invitation d&apos;amitié</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {status === "pending" && (
          <>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Vous avez été invité à être ami sur MindTrack ! Acceptez cette invitation pour commencer à suivre vos habitudes ensemble et vous motiver mutuellement.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleAcceptInvitation}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Accepter l&apos;invitation
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDecline}
                disabled={loading}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Décliner
              </Button>
            </div>
          </>
        )}

        {status === "success" && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-600">Succès !</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {message}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Redirection vers votre page communauté...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-600">Erreur</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {message}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Aller au tableau de bord
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}