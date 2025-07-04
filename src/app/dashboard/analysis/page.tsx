import { getUser } from "@/lib/auth-server";
import { MoodChart } from "@/userinterface/components/analytics/mood-chart";
import { unauthorized } from "next/navigation";
import React from "react";

export default async function AnalysesPage() {
  const user = await getUser();

  if (!user) {
    return unauthorized();
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <h1 className="text-3xl font-bold">Analyses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MoodChart />
      </div>
    </div>
  );
}
