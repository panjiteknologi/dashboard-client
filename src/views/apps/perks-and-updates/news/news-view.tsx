/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { WebinarsType } from "@/types/projects";
import NewsToogleView from "./news-toogle";
import NewsCard from "./news-card";

export default function NewsView({
  setView,
  view,
  data,
}: {
  view: "grid" | "list";
  setView: Dispatch<SetStateAction<"grid" | "list">>;
  data: WebinarsType[];
}) {
  const router = useRouter();

  return (
    <Fragment>
      <NewsToogleView view={view} setView={setView} />
      <div
        className={`grid ${
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            : "space-y-4"
        }`}
      >
        {data.map((items) => (
          <NewsCard
            key={items.id}
            data={items as any}
            handleClick={() =>
              router.push(`/apps/library/webinars/${items.id}`)
            }
            view={view}
          />
        ))}
      </div>
    </Fragment>
  );
}
