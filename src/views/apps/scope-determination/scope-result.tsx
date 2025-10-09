import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Download } from "lucide-react";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";
import { ScopePagination } from "./scope-pagination";
import { Toaster, toast } from "sonner";

export const ScopeResult = () => {
  const {
    shouldQuery,
    isLoadingList,
    rows,
    // scopeLabel,
    debounced,
    showCodes,
    exportCsv,
    totalPages,
  } = useScopeDeterminationContext();

  const { highlight, page } = useScopeDeterminationContext();

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied successfully!"); // ✅ Notifikasi sukses
      })
      .catch(() => {
        toast.error("Failed to copy text."); // ❌ Notifikasi gagal
      });
  };

  // Copy semua hasil
  const handleCopyAll = () => {
    const allText = rows
      .map((r) => `${r.idx}. ${r.label}${r.code ? ` (${r.code})` : ""}`)
      .join("\n");
    
    navigator.clipboard
      .writeText(allText)
      .then(() => {
        toast.success(`${rows.length} item berhasil di-copy!`);
      })
      .catch(() => {
        toast.error("Gagal copy semua item.");
      });
  };

  // Export semua hasil
  const handleExportAll = () => {
    exportCsv(rows);
    toast.success(`${rows.length} item berhasil di-export!`);
  };

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

  return (
    <Fragment>
      <Toaster richColors position="top-right" />

      <div className="px-3">
        {!shouldQuery ? (
          <div className="text-sm text-muted-foreground">
            Ketik kata kunci untuk mulai mencari.
          </div>
        ) : isLoadingList ? (
          SkeletonResult
        ) : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Tidak ada hasil untuk{" "}
            <span className="font-medium">&quot;{debounced}&quot;</span>.
          </div>
        ) : (
          <>
            {/* Bulk Actions - Copy All & Export All */}
            <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
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
            </div>

            <Separator className="mb-6" />

            {/* Results List */}
            <div className="space-y-6">
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
                          · <span className="font-medium">Code {r.code}</span>
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
                    </div>

                    {/* <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => handleCopy(textToCopy)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        className="cursor-pointer"
                        variant="ghost"
                        onClick={() => exportCsv([r])}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div> */}

                    <Separator className="mt-6" />
                  </div>
                );
              })}
            </div>
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