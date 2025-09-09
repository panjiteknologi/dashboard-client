import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type IconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export interface MainTypes {
  title: string;
  url: string;
  icon: string | IconType;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export interface UserInfoTypes {
  username?: string;
  partner_name?: string | undefined;
  name: string;
  email: string;
  avatar: string;
}

export interface SecondaryItemTypes {
  title: string;
  url: string;
}

export interface ProjectItemTypes {
  title: string;
  url: string;
}

export interface AppSidebarTypes {
  navMain: MainTypes[];
  user: UserInfoTypes;
  navSecondary: SecondaryItemTypes[];
  projects: ProjectItemTypes[];
}
