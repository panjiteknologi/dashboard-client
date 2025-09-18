"use client";

import React, { useState } from "react";
import {
  scope9001,
  scope14001,
  scope45001,
  scopeHACCP,
  scope22000,
  scope27001,
  scope20000,
  scope21001,
  scope37301,
  scope37001,
  scopeISPO,
  scopeISCCEU,
  scopeISCCPlus,
} from "@/constant/scope";
import ScopeSelectorView from "./scope-selector";
import ScopeDisplayView from "./scope-display";
import { cx } from "@/utils";
import { THEME } from "@/constant";

const scopeMap: Record<string, string[]> = {
  "9001": scope9001,
  "14001": scope14001,
  "45001": scope45001,
  HACCP: scopeHACCP,
  "22000": scope22000,
  "27001": scope27001,
  "20000": scope20000,
  "21001": scope21001,
  "37301": scope37301,
  "37001": scope37001,
  ISPO: scopeISPO,
  ISCCEU: scopeISCCEU,
  ISCCPlus: scopeISCCPlus,
};

const labelMap: Record<string, string> = {
  "9001": "ISO 9001:2015",
  "14001": "ISO 14001:2015",
  "45001": "ISO 45001:2018",
  HACCP: "HACCP",
  "22000": "ISO 22000:2018",
  "27001": "ISO 27001:2022",
  "20000": "ISO 20000-1:2018",
  "21001": "ISO 21001:2018",
  "37301": "ISO 37301",
  "37001": "ISO 37001",
  ISPO: "ISPO",
  ISCCEU: "ISCC EU",
  ISCCPlus: "ISCC Plus",
};

export default function ScopeLibraryView() {
  const [standard, setStandard] = useState("9001");

  const standards = Object.keys(scopeMap);
  const currentScope = scopeMap[standard];
  const currentLabel = labelMap[standard];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className={cx(
              "text-xl font-bold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            Scope Library
          </h1>
          <p className="text-sm text-slate-600">
            Overview of your activities and metrics
          </p>
        </div>
        <div className="mt-1">
          <ScopeSelectorView
            standard={standard}
            setStandard={setStandard}
            standards={standards}
            labelMap={labelMap}
          />
          <ScopeDisplayView
            scopeList={currentScope}
            standardLabel={currentLabel}
          />
        </div>
      </div>
    </div>
  );
}
