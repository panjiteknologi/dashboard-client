"use client";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { WebinarsType } from "@/types/projects";
import NewsToogle from "./news-toogle";
import NewsCard from "./news-card";

export default function WebinarsView({
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
      <NewsToogle view={view} setView={setView} />
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
            data={items}
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
