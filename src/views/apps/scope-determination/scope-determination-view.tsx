import { ScopeHeader } from "./scope-header";
import { ScopeResult } from "./scope-result";

export const ScopeDeterminationView = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Results area - scrollable */}
      <div className="flex-1 overflow-y-auto">
        <ScopeResult />
      </div>

      {/* Search Input - Fixed at bottom */}
      <ScopeHeader />
    </div>
  );
};
