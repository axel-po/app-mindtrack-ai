"use client";

import { useState } from "react";
import { Habit } from "@/data/models/habits-model";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface HabitVisualizationProps {
  habits: Habit[];
}

// Couleurs pour le graphique en camembert
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export function HabitVisualization({ habits }: HabitVisualizationProps) {
  const [activeTab, setActiveTab] = useState("bar");

  if (habits.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Aucune habitude à visualiser</p>
      </Card>
    );
  }

  // Générer des données simulées pour la visualisation
  const habitData = habits.map((habit) => ({
    name: habit.name,
    progression: Math.floor(Math.random() * 100),
    emoji: habit.emoji || "✅",
  }));

  // Données pour le graphique en camembert
  const pieData = habits.map((habit) => ({
    name: habit.name,
    value: Math.floor(Math.random() * 100) + 20,
    emoji: habit.emoji || "✅",
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Visualisation des habitudes</h3>

      <Tabs defaultValue="bar" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="bar">Graphique à barres</TabsTrigger>
          <TabsTrigger value="pie">Graphique en camembert</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={habitData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded p-2 shadow-sm">
                        <p className="text-sm font-medium">
                          {data.emoji} {data.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Progression: {data.progression}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="progression" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="pie" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded p-2 shadow-sm">
                        <p className="text-sm font-medium">
                          {data.emoji} {data.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Valeur: {data.value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
