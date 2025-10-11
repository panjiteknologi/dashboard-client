import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Copy, Bot, Lightbulb, Target, ChevronDown, ChevronUp } from "lucide-react";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";
import { ScopePagination } from "./scope-pagination";
import { Toaster, toast } from "sonner";

export const ScopeResult = () => {
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
  } = useScopeDeterminationContext();

  // const handleCopy = (text: string) => {
  //   navigator.clipboard
  //     .writeText(text)
  //     .then(() => {
  //       toast.success("Copied successfully!"); // ✅ Notifikasi sukses
  //     })
  //     .catch(() => {
  //       toast.error("Failed to copy text."); // ❌ Notifikasi gagal
  //     });
  // };

  // // Copy semua hasil
  // const handleCopyAll = () => {
  //   const allText = rows
  //     .map((r) => `${r.idx}. ${r.label}${r.code ? ` (${r.code})` : ""}`)
  //     .join("\n");
    
  //   navigator.clipboard
  //     .writeText(allText)
  //     .then(() => {
  //       toast.success(`${rows.length} item berhasil di-copy!`);
  //     })
  //     .catch(() => {
  //       toast.error("Gagal copy semua item.");
  //     });
  // };

  // Export semua hasil
  // const handleExportAll = () => {
  //   exportCsv(rows);
  //   toast.success(`${rows.length} item berhasil di-export!`);
  // };

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
    if (!aiResponse) return null;

    const [showSummary, setShowSummary] = useState(true);
    const [activeResultId, setActiveResultId] = useState<string | null>(null);
    const [activeChildCode, setActiveChildCode] = useState<string | null>(null);
    const [activeChildLinkId, setActiveChildLinkId] = useState<string | null>(null);

    // Use corrected query for highlighting if available, otherwise use debounced
    const highlightQuery = aiResponse.corrected_query || debounced;

    const handleCopyAIResult = (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("AI result copied!");
        })
        .catch(() => {
          toast.error("Failed to copy AI result.");
        });
    };

    // Create summary grouped by standard
    const createSummary = () => {
      const summary: Record<string, any> = {};

      aiResponse.hasil_pencarian.forEach((result: any) => {
        const standar = result.standar || result.scope_key;

        if (!summary[standar]) {
          summary[standar] = {};
        }

        const iaf = result.iaf_code;
        if (!summary[standar][iaf]) {
          summary[standar][iaf] = {};
        }

        const naceCode = result.nace?.code;
        const naceDesc = result.nace?.description;
        const naceChildCode = result.nace_child?.code;

        // Create unique ID for linking
        const linkId = `result-${result.scope_key}-${naceCode}-${naceChildCode}`.replace(/[^a-zA-Z0-9-_]/g, '-');

        if (!summary[standar][iaf][naceCode]) {
          summary[standar][iaf][naceCode] = {
            description: naceDesc,
            children: new Map() // Change to Map to store child code with linkId
          };
        }

        if (naceChildCode) {
          summary[standar][iaf][naceCode].children.set(naceChildCode, linkId);
        }
      });

      return summary;
    };

    const summary = createSummary();

    // Scroll to result handler
    const scrollToResult = (linkId: string, childCode: string) => {
      const element = document.getElementById(linkId);
      if (element) {
        // Set sebagai active result dan child code
        setActiveResultId(linkId);
        setActiveChildCode(childCode);
        // Save the child link ID for back button
        setActiveChildLinkId(`child-link-${childCode}`);

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
      // If there's an active child link, scroll to it
      if (activeChildLinkId) {
        const childLinkElement = document.getElementById(activeChildLinkId);
        if (childLinkElement) {
          childLinkElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add temporary highlight
          childLinkElement.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-2');
          setTimeout(() => {
            childLinkElement.classList.remove('ring-2', 'ring-yellow-400', 'ring-offset-2');
          }, 1000);
          return;
        }
      }
      // Fallback to summary section
      const element = document.getElementById('summary-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Rekomendasi Scope ({aiResponse.hasil_pencarian.length})
              </span>
            </div>

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
              {showSummary && (
                <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {Object.entries(summary).map(([standar, iafData]) => (
                    <div key={standar} className="space-y-2">
                      <h5 className="text-xs font-bold text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        {highlight(standar, highlightQuery)}
                      </h5>
                      {Object.entries(iafData as Record<string, any>).map(([iaf, naceData]) => (
                        <div key={iaf} className="ml-3 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            <strong>IAF:</strong> {highlight(iaf, highlightQuery)}
                          </p>
                          {Object.entries(naceData as Record<string, any>).map(([naceCode, naceInfo]: [string, any]) => (
                            <div key={naceCode} className="ml-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                <strong>NACE Code ( {naceCode} ) :</strong> {highlight(naceInfo.description, highlightQuery)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                <strong>NACE Child:</strong>{' '}
                                {Array.from<[string, string]>(naceInfo.children.entries())
                                  .sort((a, b) => a[0].localeCompare(b[0]))
                                  .map(([childCode, linkId], idx, arr) => (
                                    <span key={childCode}>
                                      <button
                                        id={`child-link-${childCode}`}
                                        onClick={() => scrollToResult(linkId, childCode)}
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

              {/* Results Section - 2 kolom di desktop */}
              <div className="lg:col-span-2">
                <div className="space-y-3">
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
                      setActiveChildCode(result.nace_child?.code || null);
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyAIResult(JSON.stringify(result, null, 2))}
                        className="text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
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
                        {result.nace_child_details.map((detail: any, idx: number) => {
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
              </div>
            </div>
          </div>
        )}

        {/* Penjelasan */}
        {aiResponse.penjelasan && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Penjelasan
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {highlight(aiResponse.penjelasan, highlightQuery)}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopyAIResult(aiResponse.penjelasan)}
              className="text-xs mt-1"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Penjelasan
            </Button>
          </div>
        )}

        {/* Saran */}
        {aiResponse.saran && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Saran
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {highlight(aiResponse.saran, highlightQuery)}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopyAIResult(aiResponse.saran)}
              className="text-xs mt-1"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Saran
            </Button>
          </div>
        )}


        {/* Copy All AI Response */}
        <div className="mt-4 pt-3 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCopyAIResult(JSON.stringify(aiResponse, null, 2))}
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Complete AI Response
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Toaster richColors position="top-right" />

      <div className="px-3 py-4">
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
              <p className="text-base text-muted-foreground">
                Cari scope sertifikasi yang sesuai dengan perusahaan Anda
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
                Tunggu sebentar, Tasia sedang mencarikan scope yang tersedia dan cocok dengan perusahaan kamu ^_^
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
                <span className="text-sm font-medium">AI Error:</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">{aiError}</p>
            </div>
          </div>
        )}

        {/* AI Response Section - Only show when results are available */}
        <AIResponseSection />

        {!shouldQuery && !aiResponse && !isLoadingAI ? null : isLoadingList ? (
          SkeletonResult
        // ) : rows.length === 0 ? (
        //   <div className="text-sm text-muted-foreground">
        //     Tidak ada hasil untuk{" "}
        //     <span className="font-medium">&quot;{debounced}&quot;</span>.
        //   </div>
        ) : (
          <>
            {/* Bulk Actions - Copy All & Export All */}
            {/* <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyAll}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Copy All ({rows.length})</span>
                  <span className="sm:hidden">Copy All</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportAll}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export All ({rows.length})</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </div>
            </div> */}

            <Separator className="mb-6" />

            {/* Results List */}
            {/* <div className="space-y-6">
              {rows.map((r) => {
                const textToCopy = `${r.idx}. ${r.label}${
                  r.code ? ` (${r.code})` : ""
                }`;

                return (
                  <div key={`${r.idx}-${r.code ?? "x"}`} className="group">
                    <div className="text-xs text-muted-foreground">
                      <span style={{ color: "#000097" }}>
                        <b>{r.title}</b>
                      </span>
                      {showCodes && r.code ? (
                        <>
                          {" "}
                          · <span className="font-medium">IAF Code {r.code}</span>
                        </>
                      ) : null}
                    </div>

                    <div className="mt-0.5 text-lg leading-snug">
                      <button
                        className="text-primary underline-offset-4 hover:underline"
                        style={{ textAlign: "justify" }}
                        onClick={() => handleCopy(textToCopy)}
                        title="Salin item ini"
                      >
                        {highlight(r.label, debounced)}
                      </button>
                      <div>
                        <table className="table-auto border border-border rounded w-full mt-1">
                          <thead>
                            <tr>
                              <td className="text-sm p-1 text-center text-muted-foreground p-1" style={{ fontSize:'12px' }}>Nace Code</td>
                              <td className="text-sm p-1 text-center text-muted-foreground"></td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-sm border border-border p-1 text-center text-muted-foreground" style={{ fontSize:'12px' }}>01</td>
                              <td className="text-sm border border-border p-1 text-muted-foreground" style={{ fontSize:'12px' }}>{highlight('Pertanian tanaman, peternakan, perburuan dan kegiatan terkait', debounced)}</td>
                            </tr>
                            <tr>
                              <td className="text-sm border border-border p-1 text-center text-muted-foreground" style={{ fontSize:'12px' }}>02</td>
                              <td className="text-sm border border-border p-1 text-muted-foreground" style={{ fontSize:'12px' }}>{highlight('Pertanian tanaman, peternakan, perburuan dan kegiatan terkait', debounced)}</td>
                            </tr>
                            <tr>
                              <td className="text-sm border border-border p-1 text-center text-muted-foreground" style={{ fontSize:'12px' }}>03</td>
                              <td className="text-sm border border-border p-1 text-muted-foreground" style={{ fontSize:'12px' }}>{highlight('Pertanian tanaman, peternakan, perburuan dan kegiatan terkait', debounced)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Separator className="mt-6" />
                  </div>
                );
              })}
            </div> */}
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