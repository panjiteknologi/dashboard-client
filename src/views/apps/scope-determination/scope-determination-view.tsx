import { ScopeHeader } from "./scope-header";
import { ScopeResult } from "./scope-result";

export const ScopeDeterminationView = () => {
  return (
    <div className="space-y-4">
      <ScopeHeader />
      <ScopeResult />
    </div>
  );
};
