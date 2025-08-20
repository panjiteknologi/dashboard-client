import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function RegulationToggle({
  view,
  setView,
}: {
  view: "grid" | "list";
  setView: Dispatch<SetStateAction<"grid" | "list">>;
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-md font-bold">List Data Regulation</h1>

      <div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(val: "grid" | "list") => setView(val)}
        >
          <ToggleGroupItem
            value="grid"
            aria-label="Grid View"
            className="cursor-pointer"
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem
            value="list"
            aria-label="List View"
            className="cursor-pointer"
          >
            <List className="h-4 w-4 mr-1" />
            List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
