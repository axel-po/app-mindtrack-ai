import JournalView from "@/userinterface/components/journal/JournalView";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>

      <JournalView />
    </div>
  );
}
