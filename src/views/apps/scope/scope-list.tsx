"use client";

import { THEME } from "@/constant";
import { useScopeLibraryContext } from "@/context/scope-library-context";
import { cx } from "@/utils";
import React from "react";
import { ScopeSelectorView } from "./scope-selector";
import { ScopeDisplayView } from "./scope-display";

export const ScopeLibraryView = () => {
  const {
    standard,
    setStandard,
    standards,
    labelMap,
    items,
    isLoading,
    isLoadingChips,
  } = useScopeLibraryContext();

  const currentLabel = labelMap[standard] ?? "";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className={cx(
              "text-xl font-bold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            Scope Library
          </h1>
          <p className="text-sm text-slate-600">
            Pilih standar (scope) lalu lihat daftar sektor/kategori di bawah.
          </p>
        </div>

        <div className="mt-1">
          <ScopeSelectorView
            standard={standard}
            setStandard={setStandard}
            standards={standards}
            labelMap={labelMap}
            isLoading={isLoadingChips}
          />
        </div>
      </div>

      <ScopeDisplayView
        scopeList={items}
        standardLabel={currentLabel}
        isLoading={isLoading}
      />
    </div>
  );
};
