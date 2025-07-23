"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/userinterface/components/ui/card";
import { Input } from "@/userinterface/components/ui/input";
import { Button } from "@/userinterface/components/ui/button";
import { Label } from "@/userinterface/components/ui/label";
import { Send, Copy, Check } from "lucide-react";
import { inviteFriend } from "@/userinterface/actions/friendship.actions";

interface InviteFriendsProps {
  userId: string;
}

export function InviteFriends({ userId }: InviteFriendsProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    try {
      setLoading(true);
      setMessage("");
      
      const result = await inviteFriend(userId, email);
      
      if (result.success && result.data) {
        setMessage("Invitation envoyée avec succès !");
        setInviteLink(`${window.location.origin}/invite/${result.data.token}`);
        setEmail("");
      } else {
        setMessage(result.error || "Échec de l&apos;envoi de l&apos;invitation");
      }
    } catch {
      setMessage("Une erreur s&apos;est produite lors de l&apos;envoi de l&apos;invitation");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inviter des amis</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email de l&apos;ami</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez l&apos;email de votre ami"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Envoyer l&apos;invitation
            </Button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes("success") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          {inviteLink && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <Label className="text-sm font-medium">Lien d&apos;invitation</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ce lien expire dans 7 jours
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comment ça marche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Envoyer une invitation</p>
                <p className="text-sm text-gray-500">
                  Entrez l&apos;email de votre ami et nous lui enverrons une invitation pour rejoindre MindTrack
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Ils rejoignent et acceptent</p>
                <p className="text-sm text-gray-500">
                  Votre ami crée un compte et accepte votre demande d&apos;amitié
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Suivre ensemble</p>
                <p className="text-sm text-gray-500">
                  Comparez vos progrès d&apos;habitudes et motivez-vous mutuellement pour rester cohérents
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}