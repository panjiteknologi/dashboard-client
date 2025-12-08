"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebarTypes } from "@/types/sidebar-types";

const DashboardLayout = ({
  children,
  menuSidebar,
  titleHeader,
  subTitleHeader,
  href,
}: {
  children: React.ReactNode;
  menuSidebar: AppSidebarTypes;
  titleHeader?: string;
  subTitleHeader?: string;
  href?: string;
}) => {
  return (
    <SidebarProvider>
      <AppSidebar data={menuSidebar} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {/* <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/summary">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem> */}
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={href}>{titleHeader}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{subTitleHeader}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 flex flex-col mx-auto p-4 w-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
