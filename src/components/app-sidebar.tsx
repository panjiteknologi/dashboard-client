"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
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
import { AppSidebarTypes } from "@/types/sidebar-types";

// Type optional supaya aman kalau kosong
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  menuData: AppSidebarTypes;
}

export function AppSidebar({ menuData, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/images/tsi-logo.png"
                    width={100}
                    height={100}
                    priority
                    alt="TSI Logo"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
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
        <NavMain items={menuData?.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={menuData?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
