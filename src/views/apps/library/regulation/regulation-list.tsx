"use client";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { RegulationType } from "@/types/projects";
import { RegulationToggleView } from "./regulation-toogle";
import { RegulationCardView } from "./regulation-card";
import { dummyRegulationData, RegulationCategory } from "@/constant/regulation-dummy";
import { cn } from "@/lib/utils";
import { RegulationDetailView } from "./regulation-detail";
import { ChevronRight } from "lucide-react";

// --- Sidebar Component V2 ---
const RegulationSidebarV2 = ({ categories, activeSubCategoryId, onSelectSubCategory }: { categories: RegulationCategory[]; activeSubCategoryId: string; onSelectSubCategory: (subCategoryId: string) => void; }) => {
  return (
    <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
      <h2 className="text-base font-semibold mb-4 text-slate-900">Kategori Regulasi</h2>
      <nav className="space-y-3">
        {categories.map((category) => (
          <div key={category.id}>
            <h3 className="font-semibold text-sm text-slate-800 mb-2 px-2">{category.name}</h3>
            <ul className="space-y-1 border-l border-slate-200">
              {category.subCategories.map((sub) => (
                <li key={sub.id}>
                  <button
                    onClick={() => onSelectSubCategory(sub.id)}
                    className={cn(
                      "w-full text-left pl-3 -ml-px py-1 text-sm text-slate-600 border-l-2 border-transparent transition-colors duration-150",
                      "hover:text-slate-800 hover:border-slate-400",
                      activeSubCategoryId === sub.id && "font-semibold text-slate-900 border-slate-500 bg-slate-100"
                    )}
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

// --- Breadcrumb Component V2 ---
const RegulationBreadcrumbV2 = ({ activeSubCategoryId, selectedRegulation, onBackToList }: { activeSubCategoryId: string; selectedRegulation: RegulationType | null; onBackToList: () => void; }) => {
  const { categoryName, subCategoryName } = useMemo(() => {
    for (const category of dummyRegulationData) {
      const subCategory = category.subCategories.find((sub) => sub.id === activeSubCategoryId);
      if (subCategory) {
        return { categoryName: category.name, subCategoryName: subCategory.name };
      }
    }
    return { categoryName: "", subCategoryName: "" };
  }, [activeSubCategoryId]);

  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-500 overflow-hidden">
      <span className="hidden md:inline">{categoryName}</span>
      <ChevronRight className="h-4 w-4 hidden md:inline" />
      <button onClick={onBackToList} className="hover:text-slate-800 hover:underline disabled:no-underline disabled:text-slate-500 truncate" disabled={!selectedRegulation}>
        {subCategoryName}
      </button>
      {selectedRegulation && (
        <>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <span className="font-semibold text-slate-700 truncate">{selectedRegulation.title}</span>
        </>
      )}
    </div>
  );
};

// --- Main Content Component V2 ---
const RegulationContentV2 = ({ regulations, view, selectedRegulation, onSelectRegulation, subCategoryId }: { regulations: RegulationType[]; view: "grid" | "list"; selectedRegulation: RegulationType | null; onSelectRegulation: (regulation: RegulationType) => void; subCategoryId: string; }) => {
  if (selectedRegulation) {
    return <RegulationDetailView regulation={selectedRegulation} />;
  }

  if (regulations.length > 0) {
    return (
      <div className={`grid ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}`}>
        {regulations.map((item) => (
          <RegulationCardView key={item.id} data={item} handleClick={() => onSelectRegulation(item)} view={view} subCategoryId={subCategoryId} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg bg-slate-50">
      <p className="text-slate-500">Tidak ada regulasi di kategori ini.</p>
    </div>
  );
};

// --- Page View Component ---
export const RegulationListView = ({ view, setView }: { view: "grid" | "list"; setView: Dispatch<SetStateAction<"grid" | "list">>; }) => {
  const [activeSubCategoryId, setActiveSubCategoryId] = useState(dummyRegulationData[0]?.subCategories[0]?.id || "");
  const [selectedRegulation, setSelectedRegulation] = useState<RegulationType | null>(null);

  const regulationsToShow = useMemo(() => {
    for (const category of dummyRegulationData) {
      const subCategory = category.subCategories.find((sub) => sub.id === activeSubCategoryId);
      if (subCategory) return subCategory.regulations;
    }
    return [];
  }, [activeSubCategoryId]);

  const handleSelectSubCategory = (subId: string) => {
    setActiveSubCategoryId(subId);
    setSelectedRegulation(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      <RegulationSidebarV2 categories={dummyRegulationData} activeSubCategoryId={activeSubCategoryId} onSelectSubCategory={handleSelectSubCategory} />
      <main className="w-full">
        {/* --- Sticky Header for Mobile --- */}
        <header className="md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <RegulationBreadcrumbV2 activeSubCategoryId={activeSubCategoryId} selectedRegulation={selectedRegulation} onBackToList={() => setSelectedRegulation(null)} />
            {!selectedRegulation && <RegulationToggleView view={view} setView={setView} />}
          </div>
          <div>
              <label htmlFor="kategori-regulasi-mobile" className="sr-only">Kategori Regulasi</label>
              <select
                id="kategori-regulasi-mobile"
                value={activeSubCategoryId}
                onChange={(e) => handleSelectSubCategory(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {dummyRegulationData.map((category) => (
                  <optgroup key={category.id} label={category.name}>
                    {category.subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
        </header>

        {/* --- Header for Desktop --- */}
        <header className="hidden md:flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
          <RegulationBreadcrumbV2 activeSubCategoryId={activeSubCategoryId} selectedRegulation={selectedRegulation} onBackToList={() => setSelectedRegulation(null)} />
          {!selectedRegulation && <RegulationToggleView view={view} setView={setView} />}
        </header>

        <div className="p-4 md:p-0 md:pt-4">
          <RegulationContentV2 regulations={regulationsToShow} view={view} selectedRegulation={selectedRegulation} onSelectRegulation={setSelectedRegulation} subCategoryId={activeSubCategoryId} />
        </div>
      </main>
    </div>
  );
};