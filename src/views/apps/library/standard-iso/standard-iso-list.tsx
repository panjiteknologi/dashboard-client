"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Eye, FileText, Plus } from "lucide-react";

// --- Types ---
export type ISOStandard = {
  id: string;
  code: string; // e.g., ISO 9001:2015
  title: string; // e.g., Quality Management Systems
  category: string; // e.g., QMS, EMS, OHS, ISMS
  updatedAt: string; // ISO date string
  fileUrl?: string; // optional download URL
};

// --- Mock data (replace with TRPC/API) ---
const MOCK_DATA: ISOStandard[] = [
  {
    id: "1",
    code: "ISO 9001:2015",
    title: "Quality Management Systems — Requirements",
    category: "QMS",
    updatedAt: "2024-11-04T00:00:00.000Z",
    fileUrl: "/files/iso/ISO-9001-2015.pdf",
  },
  {
    id: "2",
    code: "ISO 14001:2015",
    title: "Environmental Management Systems — Requirements",
    category: "EMS",
    updatedAt: "2025-02-18T00:00:00.000Z",
    fileUrl: "/files/iso/ISO-14001-2015.pdf",
  },
  {
    id: "3",
    code: "ISO 45001:2018",
    title: "Occupational Health and Safety Management Systems",
    category: "OHS",
    updatedAt: "2024-08-10T00:00:00.000Z",
    fileUrl: "/files/iso/ISO-45001-2018.pdf",
  },
  {
    id: "4",
    code: "ISO/IEC 27001:2022",
    title: "Information Security Management Systems",
    category: "ISMS",
    updatedAt: "2025-06-01T00:00:00.000Z",
    fileUrl: "/files/iso/ISO-27001-2022.pdf",
  },
];

const CATEGORIES = ["All", "QMS", "EMS", "OHS", "ISMS"] as const;

// --- Component ---
export default function StandardISOListView() {
  const router = useRouter();

  // Local UI state (swap with URL params if needed)
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_DATA.filter((row) => {
      const matchCat = category === "All" || row.category === category;
      const matchText =
        !q ||
        row.code.toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [query, category]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  // Handlers
  const handlePreview = (row: ISOStandard) => {
    // Navigate to a detail/preview page if available
    // Example: /apps/library/standard-iso/[id]
    router.push(`/apps/library/standard-iso/${row.id}`);
  };

  const handleDownload = (row: ISOStandard) => {
    if (!row.fileUrl) return;
    // Force download via a hidden link to preserve Button styles
    const a = document.createElement("a");
    a.href = row.fileUrl;
    a.download = row.fileUrl.split("/").pop() ?? row.code;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="w-full md:w-80">
            <Input
              placeholder="Cari kode / judul / kategori..."
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
            />
          </div>
          <Select
            value={category}
            onValueChange={(v) => {
              setPage(1);
              setCategory(v as (typeof CATEGORIES)[number]);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button variant="secondary" onClick={() => setQuery("")}>
            Reset
          </Button>
          <Button onClick={() => router.push("/apps/library/standard-iso/new")}>
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-2 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Kode</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead className="w-[120px]">Kategori</TableHead>
              <TableHead className="w-[160px]">Diupdate</TableHead>
              <TableHead className="w-[140px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{row.code}</span>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <div className="line-clamp-2">{row.title}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.category}</Badge>
                </TableCell>
                <TableCell>
                  {/* {moment(new Date(row.updatedAt), "dd MMM yyyy")} */}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(row)}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Lihat
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(row)}
                      disabled={!row.fileUrl}
                    >
                      <Download className="mr-2 h-4 w-4" /> Unduh
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {paged.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {paged.length} dari {total} data
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <div className="text-sm">
            Halaman <span className="font-semibold">{currentPage}</span> /{" "}
            {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
