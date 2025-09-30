import React from "react";

export const Highlight = ({
  text,
  debounced,
}: {
  text: string;
  debounced: string;
}) => {
  const q = debounced;
  if (!q) return <>{text}</>;

  const parts = text.split(
    new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig")
  );

  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark
            key={i}
            className="rounded px-0.5 bg-yellow-200/60 dark:bg-yellow-600/40"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
};
