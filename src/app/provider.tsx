"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";
import { env } from "@/env";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export function Providers({ children }: { children: React.ReactNode }) {
  // Buat QueryClient baru untuk setiap instance provider
  // Ini memastikan cache fresh saat navigasi antar halaman
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data dianggap fresh selama 5 menit
            gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection
            refetchOnWindowFocus: false, // Jangan refetch saat window focus
            refetchOnMount: true, // Refetch saat component mount
            refetchOnReconnect: true, // Refetch saat reconnect
            retry: 2, // Coba 2 kali jika gagal
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConvexProvider client={convex}>
        <ConvexQueryCacheProvider>
          <SessionProvider>{children}</SessionProvider>
        </ConvexQueryCacheProvider>
      </ConvexProvider>
    </QueryClientProvider>
  );
}
