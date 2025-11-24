import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function NewsToggleView({
  view,
  setView,
}: {
  view: "grid" | "list";
  setView: Dispatch<SetStateAction<"grid" | "list">>;
}) {
  return (
    <div className="flex items-center">
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(val: "grid" | "list") => setView(val)}
        className="bg-gray-100 rounded-lg p-1"
      >
        <ToggleGroupItem
          value="grid"
          aria-label="Grid View"
          className="cursor-pointer data-[state=on]:bg-white data-[state=on]:shadow-sm px-3 sm:px-4"
        >
          <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
          <span className="hidden sm:inline">Grid</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="list"
          aria-label="List View"
          className="cursor-pointer data-[state=on]:bg-white data-[state=on]:shadow-sm px-3 sm:px-4"
        >
          <List className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
          <span className="hidden sm:inline">List</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
