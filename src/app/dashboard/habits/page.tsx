import { unauthorized } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import HabitView from "@/userinterface/components/habits/views/HabitView";

export default async function HabitsPage() {
  const user = await getUser();

  if (!user) {
    return unauthorized();
  }

  return <HabitView />;
}
