import { Button } from "@/components/ui/button";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ScopePagination = () => {
  const { page, setPage, totalPages, isLoadingList } =
    useScopeDeterminationContext();

  return (
    <div className="flex items-center justify-between pb-10">
      <div className="text-xs text-muted-foreground">
        Halaman {page} dari {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isLoadingList}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages })
            .slice(0, 5)
            .map((_, i) => {
              const n = i + Math.max(1, Math.min(page - 2, totalPages - 4));
              if (n > totalPages) return null;
              return (
                <Button
                  key={n}
                  variant={n === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              );
            })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || isLoadingList}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
