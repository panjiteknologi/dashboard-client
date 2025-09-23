/* eslint-disable @next/next/no-img-element */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WebinarsType } from "@/types/projects";
import { useState } from "react";

export const WebinarsDetail = ({ data }: { data: WebinarsType }) => {
  const [activeTab, setActiveTab] = useState<"materi" | "sertifikat">("materi");

  const speakerInitial =
    (data.author && (data.author[0] ?? "").toUpperCase()) || "W";

  return (
    <div className="max-w-6xl grid md:grid-cols-3 gap-8 p-4">
      {/* Kolom kiri: Info utama */}
      <div className="md:col-span-2 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Webinar</Badge>
            <Badge variant="secondary">{data.level}</Badge>
          </div>

          <h1 className="text-3xl font-bold">{data.title}</h1>
          {data.subtitle && (
            <p className="text-muted-foreground">{data.subtitle}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>⭐ 0 (0 ulasan)</span>
            <span>⏱️ {data.time}</span>
            {typeof data.sessions === "number" && (
              <span>📚 {data.sessions} sesi</span>
            )}
            {typeof data.students === "number" && (
              <span>👤 {data.students} peserta</span>
            )}
          </div>
        </div>

        {/* Pembicara */}
        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
            {speakerInitial}
          </div>
          <div>
            <p className="font-medium">{data.author}</p>
            <p className="text-sm text-muted-foreground">Pembicara Webinar</p>
          </div>
        </div>

        {/* Tab Konten */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("materi")}
              className={`w-1/2 px-4 py-2 font-medium ${
                activeTab === "materi"
                  ? "bg-white border-b-2 border-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Materi
            </button>
            <button
              onClick={() => setActiveTab("sertifikat")}
              className={`w-1/2 px-4 py-2 font-medium ${
                activeTab === "sertifikat"
                  ? "bg-white border-b-2 border-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Sertifikat
            </button>
          </div>

          <div className="p-4">
            {activeTab === "materi" ? (
              <div className="divide-y">
                {Array.isArray(data.modules) && data.modules.length > 0 ? (
                  data.modules.map((modul, index) => (
                    <div key={index} className="flex items-start gap-4 py-4">
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{modul.title}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <span>⏱️ {modul.duration}</span>
                          {modul.isFree && (
                            <Badge
                              className="bg-green-100 text-green-600"
                              variant="outline"
                            >
                              Gratis
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Materi belum tersedia.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>Sertifikat akan tersedia setelah mengikuti webinar.</p>
              </div>
            )}
          </div>

          <div className="text-center pb-4">
            <Button variant="link" className="text-blue-600">
              Daftar Webinar Sekarang
            </Button>
          </div>
        </div>

        {/* Ulasan */}
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ulasan</h2>
            <Button variant="link" className="text-blue-600 text-sm">
              Lihat Semua Ulasan
            </Button>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            Belum ada ulasan
          </div>
        </div>

        {/* Webinar Terkait */}
        {Array.isArray(data.relatedWebinars) &&
          data.relatedWebinars.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Webinar Terkait</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.relatedWebinars.map((w, index) => (
                  <div
                    key={index}
                    className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={w.thumbnail || "/placeholder/webinar-thumbnail.jpg"}
                      alt={w.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {w.title}
                      </h3>
                      {w.price && (
                        <p className="text-sm text-muted-foreground">
                          {w.price}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
