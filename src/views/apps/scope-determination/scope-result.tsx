/* eslint-disable @next/next/no-img-element */
import { Fragment, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Lightbulb,
  Target,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Download,
  RotateCcw,
  Pencil,
  Copy,
  RefreshCw,
  Check,
  AlertCircle,
} from "lucide-react";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";
import { ScopePagination } from "./scope-pagination";
import { Toaster, toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScopeDeterminationResponse, ChatMessage } from "@/types/scope";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NaceChildDetail {
  code: string;
  title: string;
  description: string;
}

interface HasilPencarian {
  standar?: string;
  scope_key: string;
  iaf_code: string;
  nace?: { code?: string; description?: string };
  nace_child?: { code?: string; title?: string };
  relevance_score?: number;
  nace_child_details: NaceChildDetail[];
}

interface ResultWithScore extends HasilPencarian {
  calculatedScore?: number;
}

interface NaceInfo {
  description?: string;
  children: Map<string, string>;
}

type Summary = Record<string, Record<string, Record<string, NaceInfo>>>;

// ─── Scope Result Cards (reusable) ────────────────────────────────────────────
const ScopeResultCards = ({
  response,
  selectedLang,
  highlight,
}: {
  response: ScopeDeterminationResponse;
  selectedLang: "IDN" | "EN";
  highlight: (text: string, q: string) => React.ReactNode;
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [activeChildCode, setActiveChildCode] = useState<string | null>(null);
  const [activeChildLinkId, setActiveChildLinkId] = useState<string | null>(null);
  const [pendingScrollTo, setPendingScrollTo] = useState<string | null>(null);
  const [showAllResults, setShowAllResults] = useState(false);

  const highlightQuery = response.corrected_query || response.query || "";

  // Open summary by default on desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) setShowSummary(true);
  }, []);

  useEffect(() => {
    if (pendingScrollTo && showSummary) {
      const el = document.getElementById(pendingScrollTo);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-yellow-400", "ring-offset-2");
        setTimeout(() => el.classList.remove("ring-2", "ring-yellow-400", "ring-offset-2"), 1000);
      }
      setPendingScrollTo(null);
    }
  }, [pendingScrollTo, showSummary]);

  const getFilteredResults = (): ResultWithScore[] => {
    if (!response.hasil_pencarian?.length) return [];
    const scored = response.hasil_pencarian.map((r: HasilPencarian) => {
      let score = r.relevance_score || 0;
      const keywords = highlightQuery.toLowerCase().split(" ");
      const searchText = [
        r.standar || "",
        r.scope_key || "",
        r.nace?.description || "",
        r.nace_child?.title || "",
      ]
        .join(" ")
        .toLowerCase();
      keywords.forEach((kw) => {
        if (kw.length > 2 && searchText.includes(kw)) score += 5;
      });
      return { ...r, calculatedScore: score };
    });
    scored.sort((a, b) => b.calculatedScore - a.calculatedScore);
    return showAllResults ? scored : scored.slice(0, 5);
  };

  const filteredResults = getFilteredResults();

  const createSummary = (): Summary => {
    const summary: Summary = {};
    const resultsToUse = showAllResults ? response.hasil_pencarian : filteredResults;
    resultsToUse.forEach((result: HasilPencarian) => {
      const standar = result.standar || result.scope_key;
      const iaf = result.iaf_code;
      const naceCode = result.nace?.code ?? "N/A";
      const naceDesc = result.nace?.description;
      const naceChildCode = result.nace_child?.code;
      const linkId = `result-${result.scope_key}-${naceCode}-${naceChildCode}`.replace(/[^a-zA-Z0-9-_]/g, "-");
      if (!summary[standar]) summary[standar] = {};
      if (!summary[standar][iaf]) summary[standar][iaf] = {};
      if (!summary[standar][iaf][naceCode]) {
        summary[standar][iaf][naceCode] = { description: naceDesc, children: new Map() };
      }
      if (naceChildCode) summary[standar][iaf][naceCode].children.set(naceChildCode, linkId);
    });
    return summary;
  };

  const summary = createSummary();

  const scrollToResult = (linkId: string, childCode: string, uniqueChildLinkId: string) => {
    const el = document.getElementById(linkId);
    if (el) {
      setActiveResultId(linkId);
      setActiveChildCode(childCode);
      setActiveChildLinkId(uniqueChildLinkId);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-blue-500", "ring-offset-2");
      setTimeout(() => el.classList.remove("ring-2", "ring-blue-500", "ring-offset-2"), 1000);
    }
  };

  const scrollToSummary = () => {
    if (activeChildLinkId) {
      if (!showSummary) {
        setShowSummary(true);
        setPendingScrollTo(activeChildLinkId);
      } else {
        const el = document.getElementById(activeChildLinkId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-yellow-400", "ring-offset-2");
          setTimeout(() => el.classList.remove("ring-2", "ring-yellow-400", "ring-offset-2"), 1000);
        }
      }
    } else {
      document.getElementById("summary-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const findLinkIdForNaceChildCode = (naceChildCode: string, standardContext = ""): HasilPencarian | null => {
    const resultsToSearch = showAllResults ? response.hasil_pencarian : filteredResults;
    if (standardContext) {
      for (const r of resultsToSearch) {
        if ((r.standar || r.scope_key) === standardContext && r.nace_child?.code === naceChildCode) return r;
      }
    }
    for (const r of resultsToSearch) {
      if (r.nace_child?.code === naceChildCode) return r;
    }
    return null;
  };

  const renderExplanationText = (text: string, keyPrefix: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    let currentStandard = "";
    return lines.map((line, idx) => {
      const ek = `${keyPrefix}-${idx}`;
      const numberedHeaderMatch = line.match(/^\*\*(\d+\.\s+(.+?))\*\*\s*\((\d+)%\)/);
      if (numberedHeaderMatch) {
        currentStandard = numberedHeaderMatch[2].trim();
        return (
          <div key={ek} className="mt-4 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700" data-standard={currentStandard}>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-blue-900 dark:text-blue-100">{numberedHeaderMatch[1]}</h4>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold rounded">
                {numberedHeaderMatch[3]}% Match
              </span>
            </div>
          </div>
        );
      }
      const boldMatch = line.match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        return <p key={ek} className="font-bold text-lg text-gray-900 dark:text-gray-100 mt-4 mb-2">{boldMatch[1]}</p>;
      }
      if (line.startsWith("IAF:")) {
        return (
          <div key={ek} className="mt-3 mb-2 pl-3 border-l-4 border-blue-400 dark:border-blue-600">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{highlight(line, highlightQuery)}</p>
          </div>
        );
      }
      if (line.startsWith("NACE Code")) {
        return (
          <div key={ek} className="mt-2 pl-6">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{highlight(line, highlightQuery)}</p>
          </div>
        );
      }
      const naceChildMatch = line.match(/^NACE Child: (.+?)$/);
      if (naceChildMatch) {
        const codes = naceChildMatch[1].split(",").map((c) => c.trim());
        return (
          <div key={ek} className="mb-3 pl-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">NACE Child: </span>
              {codes.map((code, codeIdx) => {
                const result = findLinkIdForNaceChildCode(code, currentStandard);
                if (result?.nace_child) {
                  const linkId = `result-${result.scope_key}-${result.nace?.code}-${result.nace_child?.code}`.replace(/[^a-zA-Z0-9-_]/g, "-");
                  const uniqueChildLinkId = `child-link-${result.standar || result.scope_key}-${result.iaf_code}-${result.nace?.code ?? "N/A"}-${result.nace_child.code}`.replace(/[^a-zA-Z0-9-_]/g, "-");
                  return (
                    <span key={`${ek}-code-${codeIdx}`}>
                      <button onClick={() => scrollToResult(linkId, code, uniqueChildLinkId)} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 font-medium text-xs transition-colors">
                        {code}
                      </button>
                      {codeIdx < codes.length - 1 && <span className="mx-1">,</span>}
                    </span>
                  );
                }
                return <span key={`${ek}-code-${codeIdx}`}>{code}{codeIdx < codes.length - 1 && ", "}</span>;
              })}
            </p>
          </div>
        );
      }
      if (line.trim()) {
        return <p key={ek} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-1">{highlight(line, highlightQuery)}</p>;
      }
      return null;
    });
  };

  const handleExportAll = () => {
    const resultsToExport = showAllResults ? response.hasil_pencarian : filteredResults;
    const resultsText = resultsToExport
      .map((res: HasilPencarian, index: number) => {
        const details = res.nace_child_details
          .map((det) => `      - Code ${det.code}: ${det.title} - ${det.description}`)
          .join("\n");
        return `\n--- REKOMENDASI KE-${index + 1} ---\n  Standar: ${res.standar || res.scope_key}\n  IAF Code: ${res.iaf_code}\n  NACE Code: ${res.nace?.code || "-"} (${res.nace?.description || "-"})\n  NACE Child: ${res.nace_child?.code || "-"} (${res.nace_child?.title || "-"})\n  Skor Relevansi: ${res.relevance_score || 0}%\n\n  Detail Kode NACE Child:\n${details}`;
      })
      .join("\n");

    const fileContent = `=============================================\n  LAPORAN PENENTUAN SCOPE SERTIFIKASI (AI)\n=============================================\n\nKata Kunci: ${response.query}\nHasil Koreksi: ${response.corrected_query || "-"}\n\n=============================================\n  PENJELASAN AI\n=============================================\n${response.penjelasan}\n\n=============================================\n  SARAN\n=============================================\n${response.saran}\n\n=============================================\n  TOTAL REKOMENDASI (${response.hasil_pencarian.length} Hasil)\n=============================================\n${resultsText}\n`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scope-report-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(selectedLang === "IDN" ? `Berhasil mengekspor ${resultsToExport.length} hasil!` : `Successfully exported ${resultsToExport.length} results!`);
  };

  if (!response.hasil_pencarian?.length) {
    return (
      <div className="mt-4 space-y-4">
        {/* Not Found Alert */}
        <div className="rounded-lg border-2 border-red-400 bg-red-50 dark:bg-red-950/30 dark:border-red-600 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-base font-bold text-red-700 dark:text-red-300">
                {selectedLang === "IDN"
                  ? "Scope Tidak Tersedia di PT TSI"
                  : "Scope Not Available at PT TSI"}
              </p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {selectedLang === "IDN"
                  ? "PT TSI tidak memiliki akreditasi untuk ruang lingkup yang Anda cari. Berikut penjelasan dari sistem:"
                  : "PT TSI does not hold accreditation for the scope you searched. See the system explanation below:"}
              </p>
            </div>
          </div>
        </div>

        {/* AI Explanation for not found */}
        {response.penjelasan && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                {selectedLang === "IDN" ? "Penjelasan" : "Explanation"}
              </span>
            </div>
            <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              {renderExplanationText(response.penjelasan, "nf-penjelasan")}
            </div>
          </div>
        )}

        {/* Saran / contact info */}
        {response.saran && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                {selectedLang === "IDN" ? "Saran" : "Suggestion"}
              </span>
            </div>
            <div className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
              {renderExplanationText(response.saran, "nf-saran")}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <Target className="h-4 w-4 text-green-600" />
        <span className="text-sm font-semibold text-green-800 dark:text-green-200">
          {selectedLang === "IDN"
            ? `${filteredResults.length} Scope Direkomendasikan`
            : `${filteredResults.length} Scopes Recommended`}
        </span>
        {response.hasil_pencarian.length > 5 && (
          <Button variant="outline" size="sm" onClick={() => setShowAllResults(!showAllResults)} className="text-xs h-6">
            {showAllResults
              ? selectedLang === "IDN" ? `Top 5 saja` : `Show top 5`
              : selectedLang === "IDN" ? `Lihat semua (${response.hasil_pencarian.length})` : `Show all (${response.hasil_pencarian.length})`}
          </Button>
        )}
      </div>

      {/* Grid: summary + cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary panel */}
        <div className="lg:col-span-1">
          <div id="summary-section" className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => setShowSummary(!showSummary)}>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                📋 {selectedLang === "IDN" ? "Ringkasan" : "Summary"}
                <Badge variant="outline" className="text-xs">{Object.keys(summary).length} {selectedLang === "IDN" ? "Standar" : "Standards"}</Badge>
              </h4>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {showSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            {showSummary && (
              <>
                <div className="mb-3 flex gap-2">
                  <Button size="sm" variant="default" onClick={handleExportAll} className="flex-1 gap-1 bg-green-600 hover:bg-green-700 text-white text-xs">
                    <Download className="h-3 w-3" />
                    {selectedLang === "IDN" ? "Export" : "Export"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => document.getElementById("penjelasan-section")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex-1 text-xs" style={{ background: "#ffd943" }}>
                    {selectedLang === "IDN" ? "Penjelasan" : "Explanation"}
                  </Button>
                </div>
                <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {Object.entries(summary).map(([standar, iafData]) => (
                    <div key={standar} className="space-y-2">
                      <h5 className="text-xs font-bold text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        {highlight(standar, highlightQuery)}
                      </h5>
                      {Object.entries(iafData as Record<string, Record<string, NaceInfo>>).map(([iaf, naceData]) => (
                        <div key={iaf} className="ml-3 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                          <p className="text-xs text-gray-700 dark:text-gray-300"><strong>IAF:</strong> {highlight(iaf, highlightQuery)}</p>
                          {Object.entries(naceData as Record<string, NaceInfo>).map(([naceCode, naceInfo]) => (
                            <div key={naceCode} className="ml-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                <strong>NACE ({naceCode}):</strong> {highlight(naceInfo.description ?? "", highlightQuery)}
                              </p>
                              <p className="text-xs text-gray-500">
                                <strong>NACE Child:</strong>{" "}
                                {Array.from<[string, string]>(naceInfo.children.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([childCode, linkId], idx, arr) => (
                                  <span key={childCode}>
                                    <button
                                      id={`child-link-${standar}-${iaf}-${naceCode}-${childCode}`.replace(/[^a-zA-Z0-9-_]/g, "-")}
                                      onClick={() => {
                                        const uniqueChildLinkId = `child-link-${standar}-${iaf}-${naceCode}-${childCode}`.replace(/[^a-zA-Z0-9-_]/g, "-");
                                        scrollToResult(linkId, childCode, uniqueChildLinkId);
                                      }}
                                      className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                                    >
                                      {childCode}
                                    </button>
                                    {idx < arr.length - 1 && ", "}
                                  </span>
                                ))}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Result cards */}
        <div className="lg:col-span-2 space-y-3">
          {filteredResults.map((result, index) => {
            const resultId = `result-${result.scope_key}-${result.nace?.code}-${result.nace_child?.code}`.replace(/[^a-zA-Z0-9-_]/g, "-");
            const isActive = activeResultId === resultId;
            const displayScore = (result as ResultWithScore).calculatedScore || result.relevance_score || 0;
            const scoreColor =
              displayScore >= 85 ? "bg-green-500" :
              displayScore >= 70 ? "bg-blue-500" :
              displayScore >= 55 ? "bg-amber-500" : "bg-gray-400";
            const scoreBg =
              displayScore >= 85 ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" :
              displayScore >= 70 ? "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800" :
              displayScore >= 55 ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" :
                                   "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
            const scoreLabel =
              displayScore >= 85 ? (selectedLang === "IDN" ? "Sangat Relevan" : "Highly Relevant") :
              displayScore >= 70 ? (selectedLang === "IDN" ? "Relevan" : "Relevant") :
              displayScore >= 55 ? (selectedLang === "IDN" ? "Cukup Relevan" : "Moderate") :
                                   (selectedLang === "IDN" ? "Kurang Relevan" : "Low Relevance");

            return (
              <div
                key={`result-${index}-${result.scope_key}-${result.nace_child?.code || "no-code"}`}
                id={resultId}
                onClick={() => {
                  setActiveResultId(resultId);
                  const childCode = result.nace_child?.code || null;
                  setActiveChildCode(childCode);
                  if (childCode) {
                    const uniqueChildLinkId = `child-link-${result.standar || result.scope_key}-${result.iaf_code}-${result.nace?.code ?? "N/A"}-${childCode}`.replace(/[^a-zA-Z0-9-_]/g, "-");
                    setActiveChildLinkId(uniqueChildLinkId);
                  } else {
                    setActiveChildLinkId(null);
                  }
                }}
                className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isActive ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* ── Card Header ── */}
                <div className={`flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 ${scoreBg} border-b border-inherit`}>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/80 dark:bg-black/20 border border-current flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
                      {highlight(result.standar || result.scope_key, highlightQuery)}
                    </span>
                    {index === 0 && (
                      <span className="flex-shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-yellow-400 text-yellow-900">
                        ★ Best
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${scoreColor}`} />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {Math.round(displayScore)}%
                    </span>
                    <span className="text-xs text-gray-400 hidden xs:inline">·</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">{scoreLabel}</span>
                  </div>
                </div>

                {/* ── IAF & NACE Info ── */}
                <div className="bg-white dark:bg-gray-900 px-3 sm:px-4 py-3 space-y-2">
                  {result.iaf_code && (
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-12 sm:w-16 pt-0.5">IAF</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium break-words min-w-0">
                        {highlight(result.iaf_code, highlightQuery)}
                      </span>
                    </div>
                  )}
                  {result.nace?.code && (
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-12 sm:w-16 pt-0.5">NACE</span>
                      <div className="flex items-start gap-2 flex-wrap min-w-0">
                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
                          {result.nace.code}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 break-words">
                          {highlight(result.nace.description || "", highlightQuery)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── NACE Child Details Table ── */}
                {result.nace_child_details?.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-gray-800">
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {selectedLang === "IDN" ? "Sub-Aktivitas" : "Sub-Activities"}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold">
                        {result.nace_child_details.length}
                      </span>
                    </div>

                    {/* Mobile: list */}
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 lg:hidden">
                      {result.nace_child_details.map((detail, idx) => (
                        <div key={`detail-m-${idx}-${detail.code}`} className="px-3 sm:px-4 py-3 bg-white dark:bg-gray-900">
                          <div className="flex items-start gap-2 mb-1 flex-wrap">
                            <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
                              {detail.code}
                            </span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words min-w-0">
                              {highlight(detail.title, highlightQuery)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                            {highlight(detail.description, highlightQuery)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Desktop: table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-20">Kode</th>
                            <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-52">Aktivitas</th>
                            <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Deskripsi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60 bg-white dark:bg-gray-900">
                          {result.nace_child_details.map((detail, idx) => (
                            <tr
                              key={`detail-d-${idx}-${detail.code}`}
                              className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors"
                            >
                              <td className="px-4 py-2.5 align-top">
                                <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono whitespace-nowrap">
                                  {detail.code}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 align-top">
                                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug">
                                  {highlight(detail.title, highlightQuery)}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 align-top">
                                <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {highlight(detail.description, highlightQuery)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {response.penjelasan && (
        <div id="penjelasan-section" className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-base font-semibold text-amber-900 dark:text-amber-100">Penjelasan</span>
            <Button size="icon" onClick={() => document.getElementById("summary-section")?.scrollIntoView({ behavior: "smooth" })} className="ml-auto" style={{ width: "fit-content", padding: "10px", background: "#15127b", height: "21px" }}>
              Back <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">{renderExplanationText(response.penjelasan, "exp-penjelasan")}</div>
        </div>
      )}

      {/* Disclaimer */}
      {response.saran && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-base font-semibold text-purple-900 dark:text-purple-100">Disclaimer</span>
          </div>
          <div className="space-y-1">{renderExplanationText(response.saran, "exp-saran")}</div>
        </div>
      )}
    </div>
  );
};

// ─── Chat Message Bubble ───────────────────────────────────────────────────────
const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("_") && part.endsWith("_"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
};

const parseTableRow = (line: string): string[] =>
  line.split("|").slice(1, -1).map((c) => c.trim());

const isSeparatorRow = (line: string): boolean =>
  /^\|[\s\-:|]+\|$/.test(line.trim());

const renderTable = (tableLines: string[], key: string) => {
  const headerCells = parseTableRow(tableLines[0]);
  const dataLines = tableLines.slice(isSeparatorRow(tableLines[1] ?? "") ? 2 : 1);

  return (
    <div key={key} className="my-3 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
      <table className="w-full">
        <thead className="bg-blue-50 dark:bg-blue-900/30">
          <tr>
            {headerCells.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left text-xs font-bold text-blue-900 dark:text-blue-100 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {dataLines.map((row, ri) => (
            <tr key={ri} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
              {parseTableRow(row).map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300 align-top leading-relaxed">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderMessageContent = (content: string) => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let k = 0; // single counter — guaranteed unique across all element types

  const nextKey = () => `mc-${k++}`;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ─ Markdown table ─
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 1) {
        elements.push(renderTable(tableLines, nextKey()));
      }
      continue;
    }

    // ─ Horizontal rule ─
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      elements.push(<hr key={nextKey()} className="my-3 border-gray-200 dark:border-gray-700" />);
      i++; continue;
    }

    // ─ Empty line ─
    if (!trimmed) {
      elements.push(<div key={nextKey()} className="h-1.5" />);
      i++; continue;
    }

    // ─ Heading (## or ###) ─
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const cls = level === 1
        ? "text-base font-bold text-gray-900 dark:text-gray-100 mt-3 mb-1"
        : level === 2
        ? "text-sm font-bold text-gray-800 dark:text-gray-200 mt-2 mb-1"
        : "text-xs font-bold text-gray-700 dark:text-gray-300 mt-2 mb-0.5";
      elements.push(<p key={nextKey()} className={cls}>{renderInline(headingMatch[2])}</p>);
      i++; continue;
    }

    // ─ Bold-only line acting as heading ─
    const boldLineMatch = trimmed.match(/^\*\*(.+?)\*\*\s*:?\s*$/);
    if (boldLineMatch) {
      elements.push(
        <p key={nextKey()} className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-3 mb-1">
          {boldLineMatch[1]}
        </p>
      );
      i++; continue;
    }

    // ─ Bullet list (•, -, *) ─
    const bulletMatch = trimmed.match(/^([•\-\*])\s+(.+)$/);
    if (bulletMatch) {
      const listItems: string[] = [];
      while (i < lines.length && /^([•\-\*])\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[•\-\*]\s+/, ""));
        i++;
      }
      const ulKey = nextKey();
      elements.push(
        <ul key={ulKey} className="my-1.5 space-y-1 pl-4">
          {listItems.map((item, li) => (
            <li key={`${ulKey}-${li}`} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 flex-shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // ─ Numbered list ─
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      const listItems: { num: string; text: string }[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const m = lines[i].trim().match(/^(\d+)\.\s+(.+)$/);
        if (m) listItems.push({ num: m[1], text: m[2] });
        i++;
      }
      const olKey = nextKey();
      elements.push(
        <ol key={olKey} className="my-1.5 space-y-1 pl-2">
          {listItems.map((item, li) => (
            <li key={`${olKey}-${li}`} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center mt-0.5">
                {item.num}
              </span>
              <span>{renderInline(item.text)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // ─ Italic note line (_text_) ─
    if (trimmed.startsWith("_") && trimmed.endsWith("_")) {
      elements.push(
        <p key={nextKey()} className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed mt-1">
          {renderInline(trimmed)}
        </p>
      );
      i++; continue;
    }

    // ─ Default paragraph ─
    elements.push(
      <p key={nextKey()} className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return elements;
};

// ─── Question Card (Claude-style) — exported for bottom-sheet use ─────────────
export interface QuestionBlock {
  question: string;
  options: string[];
}

export function extractQuestionBlocks(content: string): QuestionBlock[] {
  const blocks: QuestionBlock[] = [];
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  let i = 0;
  while (i < lines.length) {
    const ahead: string[] = [];
    let j = i + 1;
    while (j < lines.length) {
      const m = lines[j].match(/^(\d+)\.\s+(.+)$/);
      if (m) { ahead.push(m[2].trim()); j++; }
      else break;
    }
    if (ahead.length >= 2) { blocks.push({ question: lines[i], options: ahead }); i = j; }
    else i++;
  }
  return blocks;
}

export const QuestionCard = ({
  blocks,
  onSubmit,
  disabled,
  selectedLang,
}: {
  blocks: QuestionBlock[];
  onSubmit: (answer: string) => void;
  disabled: boolean;
  selectedLang: "IDN" | "EN";
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);
  const [showOther, setShowOther] = useState(false);
  const [otherText, setOtherText] = useState("");

  const current = blocks[currentIdx];
  if (!current) return null;

  const mainOptions = current.options.filter((o) => !/lain(nya)?|other/i.test(o));

  const advance = (answer: string) => {
    const next = [...collected];
    next[currentIdx] = answer;
    setCollected(next);
    setShowOther(false);
    setOtherText("");
    if (currentIdx < blocks.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const parts = next.filter(Boolean);
      onSubmit(parts.length === 1 ? parts[0] : parts.map((a, i) => `${i + 1}. ${a}`).join("\n"));
    }
  };

  const handleSkip = () => {
    setShowOther(false);
    setOtherText("");
    if (currentIdx < blocks.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const parts = collected.filter(Boolean);
      if (parts.length > 0)
        onSubmit(parts.length === 1 ? parts[0] : parts.map((a, i) => `${i + 1}. ${a}`).join("\n"));
    }
  };

  return (
    <div className="overflow-hidden w-full bg-gradient-to-b from-sky-50 to-blue-50 dark:from-blue-950/60 dark:to-blue-950/40">
      {/* Header */}
      <div className="flex items-start gap-2 px-4 py-3 bg-blue-500 dark:bg-blue-700 border-b border-blue-400 dark:border-blue-600">
        <p className="flex-1 text-sm font-semibold text-white leading-snug">
          {current.question}
        </p>
        {blocks.length > 1 && (
          <div className="flex items-center gap-0.5 text-xs text-blue-100 flex-shrink-0 mt-0.5">
            <button
              onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setShowOther(false); }}
              disabled={currentIdx === 0}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-blue-400/50 disabled:opacity-30 transition-colors text-base leading-none"
            >‹</button>
            <span className="px-1 font-medium tabular-nums">
              {currentIdx + 1} {selectedLang === "IDN" ? "dari" : "of"} {blocks.length}
            </span>
            <button
              onClick={() => { setCurrentIdx(Math.min(blocks.length - 1, currentIdx + 1)); setShowOther(false); }}
              disabled={currentIdx === blocks.length - 1}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-blue-400/50 disabled:opacity-30 transition-colors text-base leading-none"
            >›</button>
          </div>
        )}
      </div>

      {/* Option rows */}
      <div className="divide-y divide-blue-100 dark:divide-blue-800/50 overflow-y-auto max-h-[260px]">
        {mainOptions.map((option, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => advance(option)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 active:bg-blue-200 dark:active:bg-blue-900/60 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xs font-bold text-blue-500 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              {idx + 1}
            </span>
            <span className="flex-1 text-sm font-medium text-blue-900 dark:text-blue-100">
              {option}
            </span>
            <ChevronRight className="h-4 w-4 text-blue-200 dark:text-blue-700 group-hover:text-blue-500 dark:group-hover:text-blue-400 flex-shrink-0 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lainnya / Other + Lewati */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-blue-100 dark:border-blue-800/50 bg-blue-50/80 dark:bg-blue-950/30">
        <Pencil className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        {showOther ? (
          <>
            <input
              autoFocus
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && otherText.trim() && advance(otherText.trim())}
              placeholder={selectedLang === "IDN" ? "Ketik jawaban Anda..." : "Type your answer..."}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-200"
            />
            <button
              onClick={() => otherText.trim() && advance(otherText.trim())}
              disabled={!otherText.trim() || disabled}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {selectedLang === "IDN" ? "Kirim" : "Send"}
            </button>
            <button
              onClick={() => { setShowOther(false); setOtherText(""); }}
              className="px-2 py-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowOther(true)}
              disabled={disabled}
              className="flex-1 text-sm text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-left cursor-pointer transition-colors disabled:cursor-not-allowed"
            >
              {selectedLang === "IDN" ? "Lainnya..." : "Other..."}
            </button>
            <button
              onClick={handleSkip}
              disabled={disabled}
              className="px-3 py-1 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-700 text-blue-500 dark:text-blue-400 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {selectedLang === "IDN" ? "Lewati" : "Skip"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const UserBubble = ({
  message,
  messageIdx,
  onEdit,
  onResend,
  disabled,
}: {
  message: ChatMessage;
  messageIdx: number;
  onEdit: (idx: number, newContent: string) => void;
  onResend: (idx: number) => void;
  disabled: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    if (editValue.trim()) onEdit(messageIdx, editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(message.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex justify-end mb-4">
        <div className="w-full max-w-[85%]">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); }
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
            rows={3}
            className="w-full rounded-2xl rounded-br-sm px-4 py-3 text-sm border-2 border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none focus:outline-none shadow-sm"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!editValue.trim()}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Kirim ulang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[85%] sm:max-w-[80%] min-w-0">
        {/* Action bar — visible on hover */}
        <div className="flex justify-end gap-0.5 mb-1 transition-opacity duration-150">
          <button
            onClick={handleCopy}
            disabled={disabled}
            title="Salin"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => { setEditValue(message.content); setIsEditing(true); }}
            disabled={disabled}
            title="Edit"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onResend(messageIdx)}
            disabled={disabled}
            title="Kirim ulang"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bubble */}
        <div className="bg-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

const AIBubble = ({ message, isLatest }: { message: ChatMessage; isLatest: boolean }) => {
  const fullText = message.content;
  const hasScopeMsg = !!message.scope_message;

  const [shownLen, setShownLen] = useState(!isLatest ? fullText.length : 0);
  // For historical messages show scope immediately; for latest, wait until typewriter + scope arrives
  const [scopeMounted, setScopeMounted] = useState(!isLatest && hasScopeMsg);
  const [scopeVisible, setScopeVisible] = useState(!isLatest && hasScopeMsg);
  const [copied, setCopied] = useState(false);

  // Typewriter animation — only for the latest message, runs once on mount
  useEffect(() => {
    if (!isLatest) return;

    if (fullText.length === 0) {
      if (hasScopeMsg) {
        setScopeMounted(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setScopeVisible(true)));
      }
      return;
    }

    let current = 0;
    const id = setInterval(() => {
      current += 15;
      if (current >= fullText.length) {
        current = fullText.length;
        clearInterval(id);
        if (hasScopeMsg) {
          setTimeout(() => {
            setScopeMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setScopeVisible(true)));
          }, 200);
        }
      }
      setShownLen(current);
    }, 20);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If this bubble is no longer the latest (new message arrived), show everything immediately
  useEffect(() => {
    if (!isLatest) {
      setShownLen(fullText.length);
      setScopeMounted(true);
      setScopeVisible(true);
    }
  }, [isLatest, fullText.length]);

  // scope_message arrives dynamically (phase 2 fetch completes) — trigger fade-in
  useEffect(() => {
    if (!message.scope_message || scopeMounted) return;
    setScopeMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setScopeVisible(true)));
  }, [message.scope_message, scopeMounted]);

  const isTyping = isLatest && shownLen < fullText.length;
  const displayedText = fullText.slice(0, shownLen);

  const handleCopy = async () => {
    const text = [message.content, message.scope_message].filter(Boolean).join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-start gap-2 sm:gap-3 mb-4">
      <img
        src="/images/tsi-logo.png"
        alt="TSI"
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain flex-shrink-0 mt-1 border border-gray-200 bg-white p-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-3 sm:px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Conversational text with typewriter */}
          <div className="text-sm text-gray-800 dark:text-gray-200 break-words">
            {displayedText && renderMessageContent(displayedText)}
            {isTyping && (
              <span className="inline-block w-0.5 h-[14px] bg-gray-500 ml-0.5 animate-pulse align-middle" />
            )}
          </div>

          {/* Scope result — fades in after typewriter completes */}
          {message.scope_message && scopeMounted && (
            <div
              className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3 transition-opacity duration-500"
              style={{ opacity: scopeVisible ? 1 : 0 }}
            >
              <div className="text-sm text-gray-800 dark:text-gray-200 break-words">
                {renderMessageContent(message.scope_message)}
              </div>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-0.5 mt-1 transition-opacity duration-150">
          <button
            onClick={handleCopy}
            title="Salin jawaban"
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {copied
              ? <><Check className="h-3.5 w-3.5 text-green-500" /><span className="text-green-500">Tersalin</span></>
              : <><Copy className="h-3.5 w-3.5" /><span>Salin</span></>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-start gap-3 mb-4">
    <img
      src="/images/tsi-logo.png"
      alt="TSI"
      className="w-8 h-8 rounded-full object-contain flex-shrink-0 mt-1 border border-gray-200 bg-white p-0.5"
    />
    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex gap-1.5 items-center h-5">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  </div>
);

// ─── Main ScopeResult component ───────────────────────────────────────────────
export const ScopeResult = () => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    shouldQuery,
    isLoadingList,
    debounced,
    totalPages,
    highlight,
    page,
    // Direct mode (quick chips)
    aiResponse,
    isLoadingAI,
    aiError,
    // Chat mode
    chatMessages,
    chatPhase,
    isChatLoading,
    isScopeLoading,
    chatError,
    chatKeywords,
    editChatMessage,
    resendChatMessage,
    resetAll,
    selectedLang,
  } = useScopeDeterminationContext();

  const isChatMode = chatMessages.length > 0 || chatPhase !== "idle";
  const isDirectMode = !isChatMode && aiResponse !== null;
  const isIdle = !isChatMode && !isDirectMode && !isLoadingAI && !aiError;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  return (
    <Fragment>
      <Toaster richColors position="top-right" />

      <div className="px-4 pb-4 max-w-4xl mx-auto w-full">
        {/* ── Welcome / Idle state ── */}
        {isIdle && !isChatLoading && (
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-lg px-4">
              <div className="mb-6 flex justify-center">
                <img src="/images/tsi-logo.png" alt="TSI Logo" className="w-32 h-32 object-contain" />
              </div>
              <h1 className="text-3xl font-bold mb-3">Scope Determination</h1>
              <p className="text-base text-muted-foreground mb-2">
                {selectedLang === "IDN"
                  ? "Ceritakan bisnis Anda — AI akan bertanya untuk memahami dan menemukan scope sertifikasi yang tepat"
                  : "Describe your business — AI will ask questions to understand and find the right certification scope"}
              </p>
              <p className="text-sm text-muted-foreground/80">
                {selectedLang === "IDN" ? "🇮🇩 Mode Bahasa Indonesia" : "🇬🇧 English mode"}
              </p>
            </div>
          </div>
        )}

        {/* ── Direct mode loading (quick chips) ── */}
        {isLoadingAI && !isChatMode && (
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-md">
              <div className="mb-4 inline-block">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {selectedLang === "IDN"
                  ? "AI sedang menganalisis scope yang tersedia..."
                  : "AI is analyzing available scopes..."}
              </p>
            </div>
          </div>
        )}

        {/* ── Direct mode error ── */}
        {aiError && !isChatMode && (
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="max-w-md p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                <Bot className="h-5 w-5" />
                <span className="text-sm font-medium">Error</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">{aiError}</p>
            </div>
          </div>
        )}

        {/* ── Direct mode results (quick chips) ── */}
        {isDirectMode && (
          <div className="mb-6 p-3 sm:p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Bot className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Scope Determination</h3>
              <Badge variant="secondary" className="text-xs">
                Query: {highlight(aiResponse!.query, aiResponse!.corrected_query || aiResponse!.query)}
              </Badge>
              {aiResponse!.corrected_query && (
                <Badge variant="default" className="text-xs bg-amber-500 hover:bg-amber-600">
                  ✓ Auto-corrected: {aiResponse!.corrected_query}
                </Badge>
              )}
            </div>
            <ScopeResultCards
              response={aiResponse!}
              selectedLang={selectedLang}
              highlight={highlight}
            />
          </div>
        )}

        {/* ── Chat mode ── */}
        {isChatMode && (
          <div className="pt-4">
            {/* Chat header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b">
              <div className="flex items-center gap-3">
                <img src="/images/tsi-logo.png" alt="TSI" className="w-8 h-8 object-contain" />
                <div>
                  <p className="text-sm font-semibold">TSI Scope Determination</p>
                  <p className="text-xs text-muted-foreground">
                    {isChatLoading
                      ? selectedLang === "IDN" ? "Sedang menganalisis..." : "Analyzing..."
                      : isScopeLoading
                      ? selectedLang === "IDN" ? "Mencari scope..." : "Searching scope..."
                      : chatKeywords
                      ? selectedLang === "IDN" ? "✅ Scope ditemukan" : "✅ Scope found"
                      : selectedLang === "IDN" ? "Online" : "Online"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={resetAll} className="text-xs gap-1 text-muted-foreground hover:text-foreground">
                <RotateCcw className="h-3 w-3" />
                {selectedLang === "IDN" ? "Mulai Ulang" : "Start Over"}
              </Button>
            </div>

            {/* Keywords used badge (when results shown) */}
            {chatKeywords && (
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">{selectedLang === "IDN" ? "Keyword yang digunakan:" : "Keywords used:"}</span>
                {chatKeywords.split(" ").map((kw) => (
                  <Badge key={kw} variant="outline" className="text-xs">{kw}</Badge>
                ))}
              </div>
            )}

            {/* Chat error */}
            {chatError && (
              <div className="mb-4 p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-xs text-red-700 dark:text-red-300">{chatError}</p>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-0">
              {chatMessages.map((msg, idx) =>
                msg.role === "user" ? (
                  <UserBubble
                    key={idx}
                    message={msg}
                    messageIdx={idx}
                    onEdit={editChatMessage}
                    onResend={resendChatMessage}
                    disabled={isChatLoading}
                  />
                ) : (
                  <AIBubble key={idx} message={msg} isLatest={idx === chatMessages.length - 1} />
                )
              )}

              {/* AI response loading */}
              {isChatLoading && <TypingIndicator />}

              {/* Scope search loading (phase 2) — prominent card */}
              {isScopeLoading && !isChatLoading && (
                <div className="flex items-start gap-2 sm:gap-3 mb-4 ml-0">
                  <img
                    src="/images/tsi-logo.png"
                    alt="TSI"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain flex-shrink-0 mt-1 border border-gray-200 bg-white p-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            {selectedLang === 'IDN' ? '🔍 Sedang mencari scope sertifikasi di PT TSI...' : '🔍 Searching certification scope at PT TSI...'}
                          </p>
                          <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">
                            {selectedLang === 'IDN'
                              ? 'Harap tunggu, sistem sedang mencocokkan bisnis Anda dengan database akreditasi TSI.'
                              : 'Please wait, the system is matching your business with the TSI accreditation database.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {shouldQuery && !isLoadingList && totalPages > 1 && !isChatMode && (
        <div className="px-2">
          <ScopePagination key={`p-${page}`} />
        </div>
      )}
    </Fragment>
  );
};
