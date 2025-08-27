"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RegulationType } from "@/types/projects";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function RegulationDetailView({
  data,
}: {
  data: RegulationType;
}) {
  const [activeTab, setActiveTab] = useState<
    "ringkasan" | "seksi" | "lampiran"
  >("ringkasan");

  const statusStyle = useMemo(() => {
    if (data.status === "Berlaku") return "bg-emerald-100 text-emerald-700";
    if (data.status === "Dicabut") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-800"; // Draft
  }, [data.status]);

  const initials = useMemo(() => {
    const issuer = data.issuer || "";
    const parts = issuer.trim().split(/\s+/);
    return (parts[0]?.[0] || "R") + (parts[1]?.[0] || "");
  }, [data.issuer]);

  const formatID = (d?: string) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="max-w-6xl grid md:grid-cols-3 gap-8 p-4">
      {/* Kiri: Info Utama */}
      <div className="md:col-span-2 space-y-4">
        {/* Header */}
        <div className="space-y-3">
          <div className="relative w-full h-52 rounded-xl overflow-hidden border">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {data.number && (
              <Badge variant="outline" className="font-medium">
                {data.number}
              </Badge>
            )}
            {data.type && <Badge variant="secondary">{data.type}</Badge>}
            {data.jurisdiction && (
              <Badge variant="outline">{data.jurisdiction}</Badge>
            )}
            {data.status && (
              <span className={`px-2 py-1 rounded-full text-xs ${statusStyle}`}>
                {data.status}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold">{data.title}</h1>
          {data.subtitle && (
            <p className="text-muted-foreground">{data.subtitle}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-gray-700">Penerbit:</span>{" "}
              {data.issuer || "-"}
            </div>
            <div>
              <span className="font-medium text-gray-700">Sektor:</span>{" "}
              {data.sector || "-"}
            </div>
            <div>
              <span className="font-medium text-gray-700">Terbit:</span>{" "}
              {formatID(data.publishedAt)}
            </div>
            <div>
              <span className="font-medium text-gray-700">Berlaku:</span>{" "}
              {formatID(data.effectiveAt)}
            </div>
          </div>
        </div>

        {/* “Penerbit” avatar ringkas */}
        {data.issuer && (
          <div className="flex items-center gap-3 mt-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
              {initials}
            </div>
            <div>
              <p className="font-medium">{data.issuer}</p>
              <p className="text-sm text-muted-foreground">Issuer</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="flex">
            {(["ringkasan", "seksi", "lampiran"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`w-1/3 px-4 py-2 font-medium ${
                  activeTab === t
                    ? "bg-white border-b-2 border-black"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t === "ringkasan"
                  ? "Ringkasan"
                  : t === "seksi"
                  ? "Seksi"
                  : "Lampiran"}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === "ringkasan" && (
              <div className="space-y-3 text-sm leading-relaxed">
                <p>{data.summary || "Belum ada ringkasan."}</p>

                {/* Kata kunci */}
                {Array.isArray(data.keywords) && data.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {data.keywords.map((k, i) => (
                      <Badge key={i} variant="outline">
                        #{k}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Sumber */}
                {data.sourceUrl && (
                  <div className="pt-3">
                    <Button asChild variant="link" className="px-0">
                      <a href={data.sourceUrl} target="_blank" rel="noreferrer">
                        Lihat Sumber Resmi ↗
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "seksi" && (
              <div className="divide-y">
                {Array.isArray(data.sections) && data.sections.length > 0 ? (
                  data.sections.map((s, i) => (
                    <div key={i} className="py-4">
                      <p className="font-medium">{s.title}</p>
                      {s.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {s.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Belum ada seksi.
                  </p>
                )}
              </div>
            )}

            {activeTab === "lampiran" && (
              <div className="space-y-3">
                {Array.isArray(data.attachments) &&
                data.attachments.length > 0 ? (
                  data.attachments.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border rounded-md p-3"
                    >
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">
                          {f.filename}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {f.url}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a href={f.url} target="_blank" rel="noreferrer">
                          Unduh
                        </a>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada lampiran.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Regulasi Terkait */}
        {Array.isArray(data.relatedRegulations) &&
          data.relatedRegulations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Regulasi Terkait</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.relatedRegulations.map((r) => (
                  <div
                    key={r.id}
                    className="border rounded-xl p-3 hover:shadow-sm transition"
                  >
                    <p className="font-medium text-sm">{r.title}</p>
                    <Button
                      asChild
                      variant="link"
                      className="px-0 text-blue-600 text-sm"
                    >
                      <a href={`/apps/library/regulation/${r.id}`}>
                        Lihat Detail →
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Kanan: Ringkasan Singkat */}
      <div className="space-y-4">
        <div className="border rounded-xl p-6 space-y-3 bg-white shadow-sm">
          <h2 className="text-lg font-semibold">Info Regulasi</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>📄 Nomor: {data.number || "-"}</p>
            <p>🏷️ Jenis: {data.type || "-"}</p>
            <p>🌍 Yurisdiksi: {data.jurisdiction || "-"}</p>
            <p>🏛️ Penerbit: {data.issuer || "-"}</p>
            <p>🏭 Sektor: {data.sector || "-"}</p>
            <p>🗓️ Terbit: {formatID(data.publishedAt)}</p>
            <p>🗓️ Berlaku: {formatID(data.effectiveAt)}</p>
            <p>🔖 Kata Kunci: {data.keywords?.length || 0}</p>
            <p>📎 Lampiran: {data.attachments?.length || 0}</p>
          </div>
          {data.sourceUrl && (
            <Button asChild className="w-full">
              <a href={data.sourceUrl} target="_blank" rel="noreferrer">
                Buka Sumber Resmi
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
