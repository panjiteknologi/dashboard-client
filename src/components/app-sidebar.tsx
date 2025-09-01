/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { AppSidebarTypes, UserInfoTypes } from "@/types/sidebar-types";
import NavMain from "./nav-main";
import { useSession } from "next-auth/react";

export function AppSidebar({ data, ...props }: { data: AppSidebarTypes }) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);

  const { data: session } = useSession();
  const user = session?.user;

  const toggleMenu = (url: string) => {
    setExpandedMenus((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const isMenuExpanded = (url: string) => expandedMenus.includes(url);

  const dataNavMain = data.navMain.map((item) => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }));

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-8 rounded-lg">
                  <Image
                    src="/images/tsi-logo.png"
                    width={32}
                    height={32}
                    priority
                    alt="TSI Logo"
                  />
                </div>
                <div className="text-left text-sm leading-tight">
                  <span className="truncate font-bold text-blue-950 text-lg">
                    Certification
                  </span>
                  <span className="truncate text-xs">Client</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={dataNavMain as any}
          toggleMenu={toggleMenu}
          isMenuExpanded={isMenuExpanded}
        />
        <NavSecondary items={data?.navSecondary as any} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user as UserInfoTypes} />
      </SidebarFooter>
    </Sidebar>
  );
}
