"use client";

import * as React from "react";
import { JournalEntryDialog } from "../create/journal-entry-dialog";
import { HabitModel } from "@/types/habit-types";

export function JournalEntryButton({ habits }: { habits: HabitModel[] }) {
  return <JournalEntryDialog habits={habits} />;
}
