import { BadgeCheck, Gift, Newspaper, Users } from "lucide-react";

export const SidebarMenuPerksAndUpdatesMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Benefit",
      url: "/apps/perks-and-updates/benefit",
      icon: Gift,
      isActive: true,
    },
    {
      title: "Rewards",
      url: "/apps/perks-and-updates/rewards",
      icon: Users,
      isActive: true,
    },
    {
      title: "Membership",
      url: "/apps/perks-and-updates/membership",
      icon: BadgeCheck,
      isActive: true,
    },
    {
      title: "News",
      url: "/apps/perks-and-updates/news",
      icon: Newspaper,
      isActive: true,
    },
  ],
  navSecondary: [],
  projects: [],
};
