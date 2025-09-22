"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import clsx from "clsx";

export type TreeNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  children?: TreeNavItem[];
  menu?: TreeNavItem[];
};

interface NavMainProps {
  items: TreeNavItem[];
  toggleMenu: (url: string) => void;
  isMenuExpanded: (url: string) => boolean;
}

export default function NavMain({
  items,
  toggleMenu,
  isMenuExpanded,
}: NavMainProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getNodeChildren = (item: TreeNavItem): TreeNavItem[] => {
    const a = item.children ?? [];
    const b = item.menu ?? [];
    return a.length || b.length ? [...a, ...b] : [];
  };

  const hasActiveDescendant = (item: TreeNavItem): boolean => {
    const kids = getNodeChildren(item);
    if (!kids.length) return false;
    return kids.some(
      (k) =>
        pathname === k.url ||
        pathname.startsWith(k.url + "/") ||
        hasActiveDescendant(k)
    );
  };

  const renderChildrenOf = (parent: TreeNavItem, depth: number) => {
    const children = getNodeChildren(parent);

    return children.map((child) => {
      const grandChildren = getNodeChildren(child);
      const hasGrand = grandChildren.length > 0;

      const isActiveSelf =
        pathname === child.url || pathname.startsWith(child.url + "/");

      const expanded =
        isMenuExpanded(child.url) ||
        (hasGrand && (isActiveSelf || hasActiveDescendant(child)));

      const leftPad = Math.max(0, 8 + depth * 12);
      const ctrlId = `submenu-${child.url.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

      return (
        <SidebarMenuItem key={child.url}>
          <SidebarMenuButton
            onClick={(e) => {
              e.preventDefault();
              if (hasGrand) {
                toggleMenu(child.url);
              } else {
                router.push(child.url);
              }
            }}
            className={clsx(
              "flex w-full items-center justify-between cursor-pointer",
              isActiveSelf && "bg-muted"
            )}
            style={{ paddingLeft: leftPad }}
            aria-expanded={hasGrand ? expanded : undefined}
            aria-controls={hasGrand ? ctrlId : undefined}
            aria-current={isActiveSelf ? "page" : undefined}
          >
            <div className="flex items-center gap-2 min-w-0">
              <child.icon className="h-4 w-4 shrink-0" />
              <span
                className={clsx("truncate", { "font-semibold": depth === 0 })}
                title={child.title}
              >
                {child.title}
              </span>
            </div>

            {hasGrand &&
              (expanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              ))}
          </SidebarMenuButton>

          {hasGrand && expanded && (
            <ul id={ctrlId} role="group" className="mt-1 pl-0">
              {renderChildrenOf(child, depth + 1)}
            </ul>
          )}
        </SidebarMenuItem>
      );
    });
  };

  return (
    <SidebarMenu>
      {items?.map((item) => (
        <SidebarMenuItem key={item.url} role="presentation">
          <div className="p-2">
            <span className="text-sm font-bold text-blue-900 tracking-tighter">
              {item.title}
            </span>
          </div>

          <ul className="mt-1">{renderChildrenOf(item, 0)}</ul>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
