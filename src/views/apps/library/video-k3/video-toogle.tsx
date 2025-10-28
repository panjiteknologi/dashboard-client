import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

export const VideoToggleView = ({ view, setView }: { view: "grid" | "list"; setView: Dispatch<SetStateAction<"grid" | "list">>; }) => {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:bg-slate-100")}>
        <LayoutGrid className="h-5 w-5" />
      </button>
      <button onClick={() => setView("list")} className={cn("p-1.5 rounded-md transition-colors", view === "list" ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:bg-slate-100")}>
        <List className="h-5 w-5" />
      </button>
    </div>
  );
};
