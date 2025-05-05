"use client";

import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface AppsNavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    uid?: number;
    username?: string;
    partner_name?: string;
  };
}

export function NavbarApps({ user }: AppsNavbarProps) {
  const { data: session } = useSession();
  const sessionUser = session?.user;

  const handleLogout = () => {
    signOut({ redirectTo: "/" });
  };

  const displayName =
    sessionUser?.name ||
    sessionUser?.partner_name ||
    sessionUser?.username ||
    "User";
  const email =
    sessionUser?.email || sessionUser?.username || "user@example.com";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto py-3 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/images/tsi-logo.png" className="h-8 w-8" alt="TSI Logo" />
          <span className="font-bold text-blue-950">Certification</span>
        </Link>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 flex items-center gap-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={sessionUser?.image || ""}
                    alt={displayName}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline truncate max-w-[100px]">
                  {displayName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
