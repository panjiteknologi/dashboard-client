"use client";

import { ScopeSearchProvider } from "@/context/scope-determination-context";
import { ScopeDeterminationView } from "@/views/apps/scope-determination";
import { Navbar } from "@/components/navbar";
import MainLayout from "@/layout/main-layout";

export default function PublicScopePage() {
  return (
    <MainLayout>
      <Navbar />
      <div>
        {/* <div className="mb-2 px-3">
          <h1 className="text-1xl font-bold text-gray-900">Scope Determination</h1>
          <p className="text-gray-600" style={{  fontSize: '12px' }}>
            Cari sektor sertifikasi yang tersedia untuk perusahaan Anda
          </p>
        </div> */}

        <ScopeSearchProvider>
          <div className="space-y-4">
            <ScopeDeterminationView />
          </div>
        </ScopeSearchProvider>
      </div>
    </MainLayout>
  );
}