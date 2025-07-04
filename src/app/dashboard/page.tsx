import { getUser } from "@/lib/auth-server";
import JournalView from "@/userinterface/components/journal/views/journal-view";
import { StatisticsCard } from "@/userinterface/components/statistics/statistics-card";
import { unauthorized } from "next/navigation";
import React from "react";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    return unauthorized();
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <StatisticsCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>

      <JournalView />
    </div>
  );
}
