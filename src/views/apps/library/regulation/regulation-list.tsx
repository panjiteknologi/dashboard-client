"use client";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { RegulationType } from "@/types/projects";
import { RegulationToggleView } from "./regulation-toogle";
import { RegulationCardView } from "./regulation-card";

export const RegulationListView = ({
  setView,
  view,
  data,
}: {
  view: "grid" | "list";
  setView: Dispatch<SetStateAction<"grid" | "list">>;
  data: RegulationType[];
}) => {
  const router = useRouter();

  return (
    <Fragment>
      <RegulationToggleView view={view} setView={setView} />
      <div
        className={`grid ${
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            : "space-y-4"
        }`}
      >
        {data.map((items) => (
          <RegulationCardView
            key={items.id}
            data={items}
            handleClick={() => router.push(`/library/regulation/${items.id}`)}
            view={view}
          />
        ))}
      </div>
    </Fragment>
  );
};
