import { Fragment, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bot, Lightbulb, Target, ChevronDown, ChevronUp, Download } from "lucide-react"; // Import 'Copy' dihilangkan
import { useScopeDeterminationContext } from "@/context/scope-determination-context";
import { ScopePagination } from "./scope-pagination";
import { Toaster, toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ScopeResult = () => {

  const handleScrollToTop = () => {
    document.getElementById('summary-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const {
    shouldQuery,
    isLoadingList,
    // rows,
    // scopeLabel,
    debounced,
    // showCodes,
    // exportCsv,
    totalPages,
    highlight,
    page,
    // AI Scope Determination from context
    aiResponse,
    isLoadingAI,
    aiError,
    // Language Selection
    selectedLang,
  } = useScopeDeterminationContext();

  const SkeletonResult = (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-2/3 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  // AI Response Component
  const AIResponseSection = () => {
    
    const [showSummary, setShowSummary] = useState(true);
    const [activeResultId, setActiveResultId] = useState<string | null>(null);
    const [activeChildCode, setActiveChildCode] = useState<string | null>(null);
    const [activeChildLinkId, setActiveChildLinkId] = useState<string | null>(null);
    const [pendingScrollTo, setPendingScrollTo] = useState<string | null>(null);

    useEffect(() => {
      if (pendingScrollTo && showSummary) {
        const element = document.getElementById(pendingScrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-2');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-yellow-400', 'ring-offset-2');
          }, 1000);
        }
        setPendingScrollTo(null); // Clear after scroll
      }
    }, [pendingScrollTo, showSummary]);

    if (!aiResponse) return null;

    // Use corrected query for highlighting if available, otherwise use debounced
    const highlightQuery = aiResponse.corrected_query || debounced;

    // Fungsi handleCopyAIResult telah dihapus karena semua tombol Copy dihilangkan

    type NaceChildMap = Map<string, string>;

    interface NaceInfo {
      description?: string;
      children: NaceChildMap;
    }

    interface Summary {
      [standar: string]: {
        [iaf: string]: {
          [naceCode: string]: NaceInfo;
        };
      };
    }

    interface HasilPencarian {
      standar?: string;
      scope_key: string;
      iaf_code: string;
      nace?: {
        code?: string;
        description?: string;
      };
      nace_child?: {
        code?: string;
        title?: string;
      };
      relevance_score?: number;
      nace_child_details: NaceChildDetail[];
    }

    interface NaceChildDetail {
      code: string;
      title: string;
      description: string;
    }


    const createSummary = (): Summary => {
      const summary: Summary = {};

      aiResponse.hasil_pencarian.forEach((result: HasilPencarian) => {
        const standar = result.standar || result.scope_key;
        const iaf = result.iaf_code;
        const naceCode = result.nace?.code ?? "N/A";
        const naceDesc = result.nace?.description;
        const naceChildCode = result.nace_child?.code;

        // Buat unique linkId untuk result
        const linkId = `result-${result.scope_key}-${naceCode}-${naceChildCode}`.replace(
          /[^a-zA-Z0-9-_]/g,
          "-"
        );

        if (!summary[standar]) summary[standar] = {};
        if (!summary[standar][iaf]) summary[standar][iaf] = {};
        if (!summary[standar][iaf][naceCode]) {
          summary[standar][iaf][naceCode] = {
            description: naceDesc,
            children: new Map(),
          };
        }

        if (naceChildCode) {
          summary[standar][iaf][naceCode].children.set(naceChildCode, linkId);
        }
      });

      return summary;
    };              

    const summary = createSummary();
    
    // START: Logic Export All dengan format rapi
    const handleExportAll = () => {
      const resultsText = aiResponse.hasil_pencarian.map((res: HasilPencarian, index: number) => {
        
        // Build details list for each result
        const details = res.nace_child_details.map((det: NaceChildDetail) => 
          `      - Code ${det.code}: ${det.title} - ${det.description}`
        ).join('\n');
        
        // Combine result info with clear formatting
        return `
--- REKOMENDASI KE-${index + 1} ---
  Standar: ${res.standar || res.scope_key}
  IAF Code: ${res.iaf_code}
  NACE Code: ${res.nace?.code || '-'} (${res.nace?.description || '-'})
  NACE Child: ${res.nace_child?.code || '-'} (${res.nace_child?.title || '-'})
  Skor Relevansi: ${res.relevance_score || 0}%

  Detail Kode NACE Child:
${details}
        `;
      }).join('\n');

      const fileContent = `
=============================================
  LAPORAN PENENTUAN SCOPE SERTIFIKASI (AI)
=============================================

Kata Kunci Pencarian: ${aiResponse.query}
Hasil Koreksi (Jika Ada): ${aiResponse.corrected_query || '-'}

=============================================
  PENJELASAN AI
=============================================
${aiResponse.penjelasan}

=============================================
  SARAN TAMBAHAN
=============================================
${aiResponse.saran}

=============================================
  TOTAL REKOMENDASI (${aiResponse.hasil_pencarian.length} Hasil)
=============================================
${resultsText}
`;

      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scope-report-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Berhasil mengekspor ${aiResponse.hasil_pencarian.length} hasil ke file TXT!`);
    };
    // END: Logic Export All


    const handleCekHasilClick = () => {
      const element = document.getElementById('penjelasan-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };


    // Scroll to result handler
    const scrollToResult = (linkId: string, childCode: string, uniqueChildLinkId: string) => {
      const element = document.getElementById(linkId);
      if (element) {
        // Set sebagai active result dan child code
        setActiveResultId(linkId);
        setActiveChildCode(childCode);
        // Save the child link ID for back button
        setActiveChildLinkId(uniqueChildLinkId);

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add temporary pulse animation
        element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
        }, 1000);
      }
    };

    // Scroll to summary handler (for mobile back button)
    const scrollToSummary = () => {
      if (activeChildLinkId) {
        // If summary is closed, open it and queue the scroll
        if (!showSummary) {
          setShowSummary(true);
          setPendingScrollTo(activeChildLinkId);
        } else {
          // If summary is open, scroll immediately
          const childLinkElement = document.getElementById(activeChildLinkId);
          if (childLinkElement) {
            childLinkElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add temporary highlight
            childLinkElement.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-2');
            setTimeout(() => {
              childLinkElement.classList.remove('ring-2', 'ring-yellow-400', 'ring-offset-2');
            }, 1000);
          }
        }
      } else {
        // Fallback to summary section if no specific child link is active
        const element = document.getElementById('summary-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Function to render explanation text with markdown and clickable NACE Child codes
    const renderExplanationText = (text: string) => {
      if (!text) return null;

      // Split text by lines
      const lines = text.split('\n');

      // Track current standard for context-aware linking
      let currentStandard = '';

      return lines.map((line, idx) => {
        // Check if line is a numbered header (starts with **1. or **2.)
        const numberedHeaderMatch = line.match(/^\*\*(\d+\.\s+(.+?))\*\*\s*\((\d+)%\)/);
        if (numberedHeaderMatch) {
          // Extract standard name (e.g., "Standard 9001:2015" from "1. Standard 9001:2015")
          currentStandard = numberedHeaderMatch[2].trim();

          return (
            <div key={idx} className="mt-4 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700" data-standard={currentStandard}>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-blue-900 dark:text-blue-100">
                  {numberedHeaderMatch[1]}
                </h4>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold rounded">
                  {numberedHeaderMatch[3]}% Match
                </span>
              </div>
            </div>
          );
        }

        // Check if line is a bold header (starts with **)
        const boldMatch = line.match(/^\*\*(.+?)\*\*/);
        if (boldMatch) {
          return (
            <p key={idx} className="font-bold text-lg text-gray-900 dark:text-gray-100 mt-4 mb-2">
              {boldMatch[1]}
            </p>
          );
        }

        // Check if line starts with IAF:
        if (line.startsWith('IAF:')) {
          return (
            <div key={idx} className="mt-3 mb-2 pl-3 border-l-4 border-blue-400 dark:border-blue-600">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                {highlight(line, highlightQuery)}
              </p>
            </div>
          );
        }

        // Check if line starts with NACE Code
        if (line.startsWith('NACE Code')) {
          return (
            <div key={idx} className="mt-2 pl-6">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {highlight(line, highlightQuery)}
              </p>
            </div>
          );
        }

        // Check if line contains NACE Child pattern
        const naceChildMatch = line.match(/^NACE Child: (.+?)$/);
        if (naceChildMatch) {
          const codesString = naceChildMatch[1];
          const codes = codesString.split(',').map(c => c.trim());

          return (
            <div key={idx} className="mb-3 pl-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">NACE Child: </span>
                {codes.map((code, codeIdx) => {
                  // Find the corresponding result object for this code with current standard context
                  const result = findLinkIdForNaceChildCode(code, currentStandard);

                  if (result && result.nace_child) {
                    const linkId = `result-${result.scope_key}-${result.nace?.code}-${result.nace_child?.code}`.replace(/[^a-zA-Z0-9-_]/g, '-');
                    const uniqueChildLinkId = `child-link-${result.standar || result.scope_key}-${result.iaf_code}-${result.nace?.code ?? "N/A"}-${result.nace_child.code}`.replace(/[^a-zA-Z0-9-_]/g, '-');
                    
                    return (
                      <span key={codeIdx}>
                        <button
                          onClick={() => scrollToResult(linkId, code, uniqueChildLinkId)}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 font-medium text-xs transition-colors"
                        >
                          {code}
                        </button>
                        {codeIdx < codes.length - 1 && <span className="mx-1">,</span>}
                      </span>
                    );
                  }
                  return <span key={codeIdx}>{code}{codeIdx < codes.length - 1 && ', '}</span>;
                })}
              </p>
            </div>
          );
        }

        // Regular line
        if (line.trim()) {
          return (
            <p key={idx} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-1">
              {highlight(line, highlightQuery)}
            </p>
          );
        }

        return null;
      });
    };

    // Helper function to find linkId for a NACE Child code with standard context
    const findLinkIdForNaceChildCode = (naceChildCode: string, standardContext: string = ''): HasilPencarian | null => {
      // If we have standard context, try to find result matching both standard and NACE Child
      if (standardContext) {
        for (const result of aiResponse.hasil_pencarian) {
          const resultStandard = result.standar || result.scope_key;
          // Check if this result matches the standard context and has the NACE Child code
          if (resultStandard === standardContext && result.nace_child?.code === naceChildCode) {
            return result;
          }
        }
      }

      // Fallback: find first result with matching NACE Child code (original behavior)
      for (const result of aiResponse.hasil_pencarian) {
        if (result.nace_child?.code === naceChildCode) {
          return result;
        }
      }
      return null;
    };

    return (
      <div className="mb-6 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            Scope Determination
          </h3>
          <Badge variant="secondary" className="text-xs">
            Query: {highlight(aiResponse.query, highlightQuery)}
          </Badge>
          {aiResponse.corrected_query && (
            <Badge variant="default" className="text-xs bg-amber-500 hover:bg-amber-600">
              ✓ Auto-corrected: {highlight(aiResponse.corrected_query, highlightQuery)}
            </Badge>
          )}
        </div>

        {/* Hasil Pencarian */}
        {aiResponse.hasil_pencarian.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              <strong className="text-blue-600 dark:text-blue-400">PT TSI Sertifikasi Internasional</strong> memiliki scope yang tersedia untuk perusahaan Anda, berikut ini scope yang disarankan :
            </p>


            {/* Grid Layout: Summary (left) | Results (right) di desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Summary Section - Sticky di desktop */}
              <div className="lg:col-span-1">
                <div id="summary-section" className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => setShowSummary(!showSummary)}>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      📋 Ringkasan Hasil Pencarian
                      <Badge variant="outline" className="text-xs">
                        {Object.keys(summary).length} Standar
                      </Badge>
                    </h4>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      {showSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  {/* --- Export All Button --- */}
                  {showSummary && (
                    <div className="mb-4 flex w-full space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={handleExportAll}
                        className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Download className="h-4 w-4" />
                        Export Hasil
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCekHasilClick}
                        className="flex-1"
                        style={{ background:'#ffd943' }}
                      >
                        Cek Penjelasan
                      </Button>
                    </div>
                  )}
                  {/* --- End Export All Button --- */}
                  {showSummary && (
                    <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {Object.entries(summary).map(([standar, iafData]) => (
                        <div key={standar} className="space-y-2">
                          <h5 className="text-xs font-bold text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                            {highlight(standar, highlightQuery)}
                          </h5>
                          {Object.entries(iafData as Record<string, Record<string, NaceInfo>>).map(([iaf, naceData]) => (
                            <div key={iaf} className="ml-3 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                              <p className="text-xs text-gray-700 dark:text-gray-300">
                                <strong>IAF:</strong> {highlight(iaf, highlightQuery)}
                              </p>
                              {Object.entries(naceData as Record<string, NaceInfo>).map(([naceCode, naceInfo]) => (
                                <div key={naceCode} className="ml-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    <strong>NACE Code ({naceCode}) :</strong>{" "}{highlight(naceInfo.description ?? "", highlightQuery)}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    <strong>NACE Child:</strong>{' '}
                                    {Array.from<[string, string]>(naceInfo.children.entries())
                                      .sort((a, b) => a[0].localeCompare(b[0]))
                                      .map(([childCode, linkId], idx, arr) => (
                                        <span key={childCode}>
                                          <button
                                            id={`child-link-${standar}-${iaf}-${naceCode}-${childCode}`.replace(/[^a-zA-Z0-9-_]/g, '-')}
                                            onClick={() => {
                                              const uniqueChildLinkId = `child-link-${standar}-${iaf}-${naceCode}-${childCode}`.replace(/[^a-zA-Z0-9-_]/g, '-');
                                              scrollToResult(linkId, childCode, uniqueChildLinkId);
                                            }}
                                            className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer font-medium"
                                          >
                                            {childCode}
                                          </button>
                                          {idx < arr.length - 1 && ', '}
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
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                  <AccordionItem value="item-1" className="border-b-0" style={{ background: 'white',padding: '5px',borderRadius: '10px', textDecoration:'none' }}>
                    <AccordionTrigger  style={{ textDecoration:'none', cursor:'pointer' }}>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Rekomendasi Scope Details ({aiResponse.hasil_pencarian.length})
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-4">
                        {aiResponse.hasil_pencarian.map((result, index) => {
                          // Create unique ID for this result card (same format as summary)
                          const resultId = `result-${result.scope_key}-${result.nace?.code}-${result.nace_child?.code}`.replace(/[^a-zA-Z0-9-_]/g, '-');
                          const isActive = activeResultId === resultId;

                          return (
                            <div
                              key={`result-${index}-${result.scope_key}-${result.nace_child?.code || 'no-code'}`}
                              id={resultId}
                              onClick={() => {
                                setActiveResultId(resultId);
                                const childCode = result.nace_child?.code || null;
                                setActiveChildCode(childCode);
                                if (childCode) {
                                  const standar = result.standar || result.scope_key;
                                  const iaf = result.iaf_code;
                                  const naceCode = result.nace?.code ?? "N/A";
                                  const uniqueChildLinkId = `child-link-${standar}-${iaf}-${naceCode}-${childCode}`.replace(/[^a-zA-Z0-9-_]/g, '-');
                                  setActiveChildLinkId(uniqueChildLinkId);
                                } else {
                                  setActiveChildLinkId(null);
                                }
                              }}
                              className={`rounded-lg p-3 bg-white dark:bg-gray-800 transition-all duration-300 cursor-pointer hover:shadow-md ${
                                isActive
                                  ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                                  : 'border border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{highlight(result.scope_key, highlightQuery)}</Badge>
                                  {result.relevance_score && (
                                    <Badge variant="outline" className="text-xs">
                                      {result.relevance_score}% match
                                    </Badge>
                                  )}
                                </div>
                                {/* Tombol Copy dihilangkan dari sini */}
                              </div>

                              <h5 className="font-medium text-sm mb-1">{highlight(result.standar, highlightQuery)}</h5>

                              {result.iaf_code && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  <strong>IAF:</strong> {highlight(result.iaf_code, highlightQuery)}
                                </p>
                              )}

                              {result.nace && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  <strong>NACE {result.nace.code}:</strong> {highlight(result.nace.description, highlightQuery)}
                                </p>
                              )}

                              {result.nace_child && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  <strong>NACE Child {result.nace_child.code}:</strong> {highlight(result.nace_child.title, highlightQuery)}
                                </p>
                              )}

                              {result.nace_child_details && Array.isArray(result.nace_child_details) && result.nace_child_details.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {/* {result.nace_child_details.map((detail: any, idx: number) => { */}
                                  {result.nace_child_details.map((detail: NaceChildDetail, idx: number) => {
                                    // Check if this specific child detail is active
                                    const isActiveChild = isActive && activeChildCode === result.nace_child?.code;

                                    return (
                                      <div
                                        key={`detail-${idx}-${detail.code}`}
                                        className={`p-2 rounded transition-all duration-300 ${
                                          isActiveChild
                                            ? 'bg-blue-100 dark:bg-blue-900/60 border-2 border-blue-500 shadow-md'
                                            : 'bg-blue-50 dark:bg-blue-900/20 border-2 border-transparent'
                                        }`}
                                      >
                                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                                          <strong>Code {detail.code}:</strong> {highlight(detail.title, highlightQuery)}
                                        </p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                          {highlight(detail.description, highlightQuery)}
                                        </p>

                                        {/* Back to Summary Button - Only show on mobile */}
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={scrollToSummary}
                                          className="mt-2 w-full lg:hidden text-xs"
                                        >
                                          <ChevronUp className="h-3 w-3 mr-1" />
                                          Kembali ke Summary
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        )}

        {/* Penjelasan */}
        {aiResponse.penjelasan && (
          <div id="penjelasan-section" className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-base font-semibold text-amber-900 dark:text-amber-100">
                Penjelasan
              </span>
              <Button
                  size="icon"
                  onClick={handleScrollToTop}
                  className=""
                  style={{ 
                    width: 'fit-content',padding: '10px',background: '#15127b', height:'21px'
                   }}
                >
                  Back<ChevronUp className="h-6 w-6" />
                </Button>
            </div>
            <div className="space-y-1">
              {renderExplanationText(aiResponse.penjelasan)}
            </div>
            {/* Tombol Copy Penjelasan DIHAPUS */}
          </div>
        )}

        {/* Saran */}
        {aiResponse.saran && (
          <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-base font-semibold text-purple-900 dark:text-purple-100">
                Disclaimer
              </span>
            </div>
            <div className="space-y-1">
              {renderExplanationText(aiResponse.saran)}
            </div>
            {/* Tombol Copy Saran DIHAPUS */}
          </div>
        )}


        {/* Copy All AI Response */}
        <div className="mt-4 pt-3 border-t">
          {/* Tombol Copy Complete AI Response DIHAPUS */}
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Toaster richColors position="top-right" />

      <div className="">
        {/* Empty State - Center Screen with Header */}
        {!aiResponse && !isLoadingAI && !aiError && (
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-lg px-4">
              <div className="mb-6 flex justify-center">
                <img
                  src="/images/tsi-logo.png"
                  alt="TSI Logo"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold mb-3">Scope Determination</h1>
              <p className="text-base text-muted-foreground mb-2">
                {selectedLang === 'IDN'
                  ? 'Cari scope sertifikasi yang sesuai dengan perusahaan Anda'
                  : 'Find certification scopes that match your company'}
              </p>
              <p className="text-sm text-muted-foreground/80">
                {selectedLang === 'IDN'
                  ? '🇮🇩 Anda sedang dalam mode Bahasa Indonesia'
                  : '🇬🇧 You are in English mode'}
              </p>
            </div>
          </div>
        )}

        {/* AI Loading State */}
        {isLoadingAI && (
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-md">
              <div className="mb-4 inline-block">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {selectedLang === 'IDN'
                  ? 'Tunggu sebentar, AI sedang menganalisis scope yang tersedia dan cocok dengan perusahaan Anda ^_^'
                  : 'Please wait, AI is analyzing available scopes that match your company ^_^'}
              </p>
            </div>
          </div>
        )}

        {/* AI Error Display */}
        {aiError && !isLoadingAI && (
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="max-w-md p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                <Bot className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {selectedLang === 'IDN' ? 'AI Error:' : 'AI Error:'}
                </span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">{aiError}</p>
            </div>
          </div>
        )}

        {/* AI Response Section - Only show when results are available */}
        <AIResponseSection />

        {!shouldQuery && !aiResponse && !isLoadingAI ? null : isLoadingList ? (
          SkeletonResult
        ) : (
          <>
            {/* Perubahan: Menghilangkan separator yang bermasalah */}
            <div className="mb-6" /> 

            {/* Results List */}
          </>
        )}
      </div>

      {shouldQuery && !isLoadingList && totalPages > 1 && (
        <div className="px-2">
          <ScopePagination key={`p-${page}`} />
        </div>
      )}
    </Fragment>
  );
};