import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Download } from "lucide-react";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";
import { ScopePagination } from "./scope-pagination";

export const ScopeResult = () => {
  const {
    shouldQuery,
    isLoadingList,
    rows,
    scopeLabel,
    debounced,
    showCodes,
    exportCsv,
    totalPages,
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

  const { highlight, page } = useScopeDeterminationContext();

  return (
    <Fragment>
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
            <span className="font-medium">“{debounced}”</span>.
          </div>
        ) : (
          <div className="space-y-6">
            {rows.map((r) => (
              <div key={`${r.idx}-${r.code ?? "x"}`} className="group">
                <div className="text-xs text-muted-foreground">
                  {scopeLabel}
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
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${r.idx}. ${r.label}${r.code ? ` (${r.code})` : ""}`
                      )
                    }
                    title="Salin item ini"
                  >
                    {highlight(r.label, debounced)}
                  </button>
                </div>

                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${r.idx}. ${r.label}${r.code ? ` (${r.code})` : ""}`
                      )
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => exportCsv([r])}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                <Separator className="mt-6" />
              </div>
            ))}
          </div>
        )}
      </div>

      {shouldQuery && !isLoadingList && totalPages > 1 && (
        <div className="px-3">
          <ScopePagination key={`p-${page}`} />
        </div>
      )}
    </Fragment>
  );
};
