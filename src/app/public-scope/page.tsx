"use client";

import { ScopeSearchProvider } from "@/context/scope-determination-context";
import { ScopeDeterminationView } from "@/views/apps/scope-determination";

export default function PublicScopePage() {
  return (
    <ScopeSearchProvider>
      <ScopeDeterminationView />
    </ScopeSearchProvider>
  );
}
