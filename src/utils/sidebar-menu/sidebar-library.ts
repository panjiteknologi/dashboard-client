import { Folder, GraduationCap, Users, Video } from "lucide-react";

export const SidebarLibraryMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Video K3",
      url: "/apps/library/video-k3",
      icon: Video,
      isActive: false,
    },
    {
      title: "Regulation",
      url: "/apps/library/regulation",
      icon: Folder,
      isActive: false,
    },
    {
      title: "Webinars",
      url: "/apps/library/webinars",
      icon: Users,
      isActive: false,
    },
    {
      title: "Standard ISO",
      url: "/apps/library/standard-iso",
      icon: GraduationCap,
      isActive: false,
    },
  ],
  navSecondary: [],
  projects: [],
};
