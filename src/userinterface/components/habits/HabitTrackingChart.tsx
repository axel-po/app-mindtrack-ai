"use client";

import React, { useEffect } from "react";
import ChartHeatmap from "./charts/chart-heatmap";
import { useHabitViewModel } from "./HabitViewModel";

export default function HabitTrackingChart() {
  const { habits, completionStatus, loadHabits } = useHabitViewModel();

  useEffect(() => {
    loadHabits();
  }, []);

  return (
    <div className="w-full">
      {habits.length > 0 && (
        <ChartHeatmap habits={habits} completionStatus={completionStatus} />
      )}
    </div>
  );
}
