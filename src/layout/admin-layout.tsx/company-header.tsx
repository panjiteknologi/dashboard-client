"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export function CompanyHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex items-center gap-2">
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <Image
          src="/images/tsi-logo.png"
          alt={user?.partner_name || "TSI Certification"}
          width={32}
          height={32}
        />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">
          {user?.partner_name || "Admin"}
        </span>
        <span className="truncate text-xs">{"Admin"}</span>
      </div>
    </div>
  );
}
