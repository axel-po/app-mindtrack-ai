import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Unauthorized() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Accès non autorisé</AlertTitle>
        <AlertDescription>
          Vous devez être connecté pour accéder à cette page. Veuillez vous
          connecter et réessayer.
        </AlertDescription>
      </Alert>
    </div>
  );
}
