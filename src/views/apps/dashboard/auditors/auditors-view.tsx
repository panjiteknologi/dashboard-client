import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuditorsContext } from "@/context/auditors-context";
import { AuditorsSearchFilter } from "./auditors-search-filter";
import { THEME } from "@/constant";
import { cx } from "@/utils";
import { AuditorsCard } from "./auditors-card";
import { AuditorsEmpty } from "./auditors-empty";
import { PaginationBar } from "@/components/pagination/pagination-bar";

export const AuditorsView = () => {
  const {
    filtered, // data yang sudah di-paging
    allRoles,
    allIsos,
    qInput,
    role,
    iso,
    limit,
    setQInput,
    setRole,
    setIso,
    setLimit,
    page,
    totalPages,
    setPage,
    refresh,
    isLoading,
    isFetching,
    isError,
    filteredCount,
    totalCount,
  } = useAuditorsContext();

  const isBusy = isLoading || isFetching;
  const isEmpty = !isBusy && !isError && filtered.length === 0;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={cx(
              "text-xl font-bold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            Dashboard Auditors
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            Pantau jadwal dan pengingat surveillance audit secara terorganisir
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          aria-label="Refresh"
          onClick={refresh}
          disabled={isFetching}
          title="Refresh data"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <AuditorsSearchFilter
        qInput={qInput}
        setQInput={(v) => {
          setQInput(v);
          setPage(1);
        }}
        role={role}
        setRole={(v) => {
          setRole(v);
          setPage(1);
        }}
        iso={iso}
        setIso={(v) => {
          setIso(v);
          setPage(1);
        }}
        limit={limit}
        setLimit={(n) => {
          setLimit(n);
          setPage(1);
        }}
        allRoles={allRoles}
        allIsos={allIsos}
        reset={() => {
          setQInput("");
          setRole("all");
          setIso("all");
          setLimit(10);
          setPage(1);
        }}
      />

      {isBusy && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse rounded-xl">
              <CardHeader>
                <div className="h-5 w-2/3 rounded bg-muted" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-6 w-full rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isBusy && isError && (
        <div className="text-sm text-red-600">
          Gagal memuat data. Coba{" "}
          <button onClick={refresh} className="underline">
            refresh
          </button>
          .
        </div>
      )}

      {!isBusy && isEmpty && <AuditorsEmpty />}

      {!isBusy && !isError && filtered.length > 0 && (
        <AuditorsCard data={filtered as []} />
      )}

      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={limit}
        onPageSizeChange={(n) => {
          setLimit(n);
          setPage(1);
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        totalCount={totalCount}
        filteredCount={filteredCount}
        disabled={isFetching}
        className="pb-2"
      />
    </div>
  );
};
