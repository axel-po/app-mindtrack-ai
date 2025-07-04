import {
  IconCamera,
  IconChartBar,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconSettings,
  IconHome,
  IconRepeat,
  IconBook,
  IconChartPie,
  IconUsersGroup,
  IconNote,
} from "@tabler/icons-react";

export const sidebarConfig = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "Habitudes",
      url: "/dashboard/habits",
      icon: IconRepeat,
    },
    {
      title: "Journal",
      url: "/dashboard/journal",
      icon: IconBook,
    },
    {
      title: "Analyse",
      url: "/dashboard/analysis",
      icon: IconChartPie,
    },
    {
      title: "Communauté",
      url: "/dashboard/community",
      icon: IconUsersGroup,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  documents: [
    {
      name: "Rapport mensuel",
      url: "/dashboard/documents/monthly-report",
      icon: IconFileDescription,
    },
    {
      name: "Analyse des habitudes",
      url: "/dashboard/documents/habits-analysis",
      icon: IconChartBar,
    },
    {
      name: "Notes personnelles",
      url: "/dashboard/documents/personal-notes",
      icon: IconNote,
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Aide",
      url: "#",
      icon: IconHelp,
    },
  ],
};
