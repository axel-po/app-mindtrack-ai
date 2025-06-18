"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sendInvitation } from "../action";
import { UsersIcon } from "lucide-react";

const inviteFormSchema = z.object({
  emails: z
    .string()
    .min(1, "Veuillez entrer au moins une adresse email")
    .refine(
      (value) => {
        // Split by comma, semicolon, or newline and validate each email
        const emails = value
          .split(/[,;\n]/)
          .map((email) => email.trim())
          .filter(Boolean);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emails.every((email) => emailRegex.test(email));
      },
      {
        message:
          "Veuillez entrer des adresses email valides, séparées par des virgules",
      }
    ),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

export function InviteFriendsDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      emails: "",
      message: "Rejoins-moi sur MindTrack pour suivre nos habitudes ensemble !",
    },
  });

  async function onSubmit(data: InviteFormValues) {
    setIsSubmitting(true);

    try {
      // Split emails by comma, semicolon, or newline
      const emailList = data.emails
        .split(/[,;\n]/)
        .map((email) => email.trim())
        .filter(Boolean);

      const result = await sendInvitation(emailList, data.message || "");

      if (result.success) {
        toast.success("Invitations envoyées avec succès !");
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.error || "Erreur lors de l'envoi des invitations");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi des invitations");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UsersIcon className="size-4" />
          Inviter des amis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter des amis</DialogTitle>
          <DialogDescription>
            Invitez vos amis à rejoindre MindTrack pour partager votre
            progression.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresses email</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="email@exemple.com, email2@exemple.com"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message personnalisé (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ajoutez un message personnalisé à votre invitation"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer les invitations"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
