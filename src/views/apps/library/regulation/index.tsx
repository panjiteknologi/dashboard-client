"use client";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import RegulationToggle from "./regulation-toogle";
import RegulationCard from "./regulation-card";
import { RegulationType } from "@/types/projects";

export default function RegulationView({
  setView,
  view,
  data,
}: {
  view: "grid" | "list";
  setView: Dispatch<SetStateAction<"grid" | "list">>;
  data: RegulationType[];
}) {
  const router = useRouter();

  return (
    <Fragment>
      <RegulationToggle view={view} setView={setView} />
      <div
        className={`grid ${
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            : "space-y-4"
        }`}
      >
        {data.map((items) => (
          <RegulationCard
            key={items.id}
            data={items}
            handleClick={() =>
              router.push(`/apps/library/regulation/${items.id}`)
            }
            view={view}
          />
        ))}
      </div>
    </Fragment>
  );
}
