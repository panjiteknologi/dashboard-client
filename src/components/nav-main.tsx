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
  toggleMenu: (url: string) => void; // gunakan url node sebagai key expand
  isMenuExpanded: (url: string) => boolean;
}

export default function NavMain({
  items,
  toggleMenu,
  isMenuExpanded,
}: NavMainProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Gabungkan children + menu
  const getNodeChildren = (item: TreeNavItem): TreeNavItem[] => {
    const a = item.children ?? [];
    const b = item.menu ?? [];
    return a.length || b.length ? [...a, ...b] : [];
  };

  // Ada descendant yang aktif?
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

  // Render anak-anak (rekursif)
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

      // buat id aman untuk aria-controls
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
              // HIGHLIGHT AKTIF DI TOMBOL (SEMUA DEPTH)
              isActiveSelf && "bg-muted"
            )}
            style={{ paddingLeft: leftPad }}
            aria-expanded={expanded}
            aria-controls={ctrlId}
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
            <div id={ctrlId} className="ml-0">
              {renderChildrenOf(child, depth + 1)}
            </div>
          )}
        </SidebarMenuItem>
      );
    });
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <div key={item.url} className="p-2">
          <span className="text-sm font-bold text-blue-900 tracking-tighter px-2">
            {item.title}
          </span>

          <ul className="mt-1">{renderChildrenOf(item, 0)}</ul>
        </div>
      ))}
    </SidebarMenu>
  );
}
