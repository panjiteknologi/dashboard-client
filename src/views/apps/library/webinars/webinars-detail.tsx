"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RegulationType } from "@/types/projects";
import { useState } from "react";

export default function WebinarsDetailView({ data }: { data: RegulationType }) {
  const [activeTab, setActiveTab] = useState<"modul" | "sertifikat">("modul");

  return (
    <div className="max-w-6xl grid md:grid-cols-3 gap-8 p-4">
      {/* Kiri: Info Utama */}
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

        {/* Instruktur */}
        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
            {data.author[0]}
          </div>
          <div>
            <p className="font-medium">{data.author}</p>
            <p className="text-sm text-muted-foreground">Course Instructor</p>
          </div>
        </div>

        {/* Tab Konten */}
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
                {data.modules?.map((modul, index) => (
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
                ))}
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

        {/* Instruktur Course */}
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

        {/* Kursus Lainnya */}
        {data.relatedCourses && data.relatedCourses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">
              Kursus Lainnya dari Instruktur Ini
            </h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.relatedCourses.map((course, index) => (
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
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kanan: Info Harga */}
      {/* <div className="space-y-4">
        <div className="border rounded-xl p-6 space-y-4 bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-right text-black">
            {data.price}
          </h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>⏱️ Durasi: {data.time}</p>
            <p>📚 {data.modules?.length} module</p>
            <p>👤 Akses: Akses Penuh Seumur Hidup</p>
          </div>
          <Button className="w-full bg-blue-600 text-white">
            Enroll Course Sekarang
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            30-Hari Jaminan Uang Kembali
          </p>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="icon">
            <i className="fab fa-twitter" />
          </Button>
          <Button variant="outline" size="icon">
            <i className="fab fa-facebook" />
          </Button>
          <Button variant="outline" size="icon">
            <i className="fab fa-linkedin" />
          </Button>
        </div>
      </div> */}
    </div>
  );
}
