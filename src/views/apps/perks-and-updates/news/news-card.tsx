import { NewsType } from "@/types/news";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, TrendingUp } from "lucide-react";

const getTypeBadgeColor = (type: string) => {
  const colors: Record<string, string> = {
    "Berita": "bg-blue-100 text-blue-700 border-blue-200",
    "Event": "bg-purple-100 text-purple-700 border-purple-200",
    "Update": "bg-orange-100 text-orange-700 border-orange-200",
    "Studi Kasus": "bg-green-100 text-green-700 border-green-200",
  };
  return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('id-ID', options);
};

export default function NewsCard({
  data,
  handleClick,
  view,
}: {
  data: NewsType;
  handleClick: () => void;
  view: "grid" | "list";
}) {
  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer group border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white hover:scale-[1.01] sm:hover:scale-[1.02] ${
        view === "list" ? "flex flex-col sm:flex-row" : "flex flex-col h-full"
      }`}
    >
      <div
        className={`${
          view === "list" ? "w-full sm:w-64 h-48 sm:h-full" : "h-48 sm:h-56"
        } relative flex-shrink-0 overflow-hidden`}
      >
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75"
        />
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <Badge className={`${getTypeBadgeColor(data.type)} border font-semibold shadow-sm text-xs`}>
            {data.type}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col p-4 sm:p-5 space-y-2 sm:space-y-3 flex-1">
        <div className="space-y-1 sm:space-y-2">
          <h3 className="font-bold text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {data.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{formatDate(data.publishedAt)}</span>
            <span className="sm:hidden">{new Date(data.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{data.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{data.students}</span>
          </div>
        </div>

        {data.keywords && data.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {data.keywords.slice(0, 2).map((keyword, index) => (
              <span
                key={index}
                className="text-xs px-1.5 sm:px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-200"
              >
                #{keyword}
              </span>
            ))}
            {data.keywords.length > 2 && (
              <span className="text-xs px-1.5 sm:px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-200">
                +{data.keywords.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 mt-auto border-t">
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-muted-foreground">
            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="truncate">{data.author}</span>
          </div>
          <span className="text-xs font-semibold text-primary group-hover:underline whitespace-nowrap">
            Baca Selengkapnya →
          </span>
        </div>
      </div>
    </div>
  );
}
