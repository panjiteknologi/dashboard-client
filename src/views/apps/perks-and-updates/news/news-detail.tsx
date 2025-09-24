/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsType } from "@/types/news";
import { useState } from "react";

export default function NewsDetailView({ data }: { data: NewsType }) {
  const [activeTab, setActiveTab] = useState<"modul" | "sertifikat">("modul");

  return (
    <div className="max-w-6xl grid md:grid-cols-3 gap-8 p-4">
      <div className="md:col-span-2 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Professional Certification</Badge>
            <Badge variant="secondary">Beginner</Badge>
          </div>
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="text-muted-foreground">{data.subtitle}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>⭐ 0 (0 ulasan)</span>
            <span>⏱️ {data.time}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
            {data.author[0]}
          </div>
          <div>
            <p className="font-medium">{data.author}</p>
            <p className="text-sm text-muted-foreground">Course Instructor</p>
          </div>
        </div>

        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("modul")}
              className={`w-1/2 px-4 py-2 font-medium ${
                activeTab === "modul"
                  ? "bg-white border-b-2 border-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Modul
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
            {activeTab === "modul" ? (
              <div className="divide-y">
                {data.modules?.map(
                  (
                    modul: { duration: string; title: string; isFree: boolean },
                    index: number
                  ) => (
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
                  )
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>
                  Sertifikat akan tersedia setelah menyelesaikan semua modul.
                </p>
              </div>
            )}
          </div>

          <div className="text-center pb-4">
            <Button variant="link" className="text-blue-600">
              Mulai Kursus Sekarang
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Instruktur Course</h2>
          <div className="flex gap-4 mt-4 p-4 border rounded-xl items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
              {data.author[0] + data.author.split(" ")[1]?.[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Saya adalah ahli Magic Chess Go Go, untuk season pertama target
                saya adalah menjadi top global hahahahahaha
              </p>
              <div className="flex gap-2 text-sm">
                <span className="font-medium">Keahlian:</span>
                <div className="flex gap-2">
                  <Badge variant="secondary">DevOps</Badge>
                  <Badge variant="secondary">ISO</Badge>
                  <Badge variant="secondary">Football</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {data.relatedCourses && data.relatedCourses?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">
              Kursus Lainnya dari Instruktur Ini
            </h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.relatedCourses?.map((course: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={
                        course.thumbnail || "/placeholder/course-thumbnail.jpg"
                      }
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Rp {parseInt(course.price).toLocaleString("id-ID")},00
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
