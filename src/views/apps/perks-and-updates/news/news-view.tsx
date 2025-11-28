"use client";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { NewsType } from "@/types/news";
import NewsToogleView from "./news-toogle";
import NewsCard from "./news-card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp, Newspaper } from "lucide-react";

const getTypeBadgeColor = (type: string) => {
  const colors: Record<string, string> = {
    Berita: "bg-blue-500 text-white",
    Event: "bg-purple-500 text-white",
    Update: "bg-orange-500 text-white",
    "Studi Kasus": "bg-green-500 text-white",
  };
  return colors[type] || "bg-gray-500 text-white";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
};

export default function NewsView({
  setView,
  view,
  data,
}: {
  view: "grid" | "list";
  setView: Dispatch<SetStateAction<"grid" | "list">>;
  data: NewsType[];
}) {
  const router = useRouter();
  const [featuredNews, ...otherNews] = data;

  return (
    <Fragment>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              Portal Berita PT TSI
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Update terkini seputar sertifikasi dan ISO
            </p>
          </div>
        </div>
        <NewsToogleView view={view} setView={setView} />
      </div>

      {/* Featured News Section */}
      {featuredNews && view === "grid" && (
        <div
          onClick={() =>
            router.push(`/perks-and-updates/news/${featuredNews.id}`)
          }
          className="mb-6 sm:mb-8 group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border-2 border-primary/20"
        >
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <Image
              src={featuredNews.image}
              alt={featuredNews.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge
                  className={`${getTypeBadgeColor(
                    featuredNews.type
                  )} px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold shadow-lg`}
                >
                  ⭐ FEATURED
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {featuredNews.type}
                </Badge>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary-foreground transition-colors">
                {featuredNews.title}
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-3 sm:mb-4 line-clamp-2 max-w-3xl">
                {featuredNews.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">
                    {formatDate(featuredNews.publishedAt)}
                  </span>
                  <span className="sm:hidden">
                    {new Date(featuredNews.publishedAt).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "short" }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{featuredNews.time}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{featuredNews.students} views</span>
                </div>
              </div>

              {featuredNews.keywords && featuredNews.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                  {featuredNews.keywords.slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Latest News Section */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <span className="w-1 h-5 sm:h-6 bg-primary rounded-full"></span>
          Berita Terbaru
        </h3>
      </div>

      <div
        className={`grid ${
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            : "space-y-3 sm:space-y-4"
        }`}
      >
        {otherNews.map((items) => (
          <NewsCard
            key={items.id}
            data={items}
            handleClick={() =>
              router.push(`/perks-and-updates/news/${items.id}`)
            }
            view={view}
          />
        ))}
      </div>
    </Fragment>
  );
}
