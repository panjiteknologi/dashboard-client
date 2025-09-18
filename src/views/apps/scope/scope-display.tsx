"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type ScopeDisplayProps = {
  scopeList: string[];
  standardLabel: string;
};

export const ScopeDisplayView = ({
  scopeList,
  standardLabel,
}: ScopeDisplayProps) => {
  return (
    <motion.div
      className="px-1 max-h-[450px] overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Daftar Scope <span className="text-primary">{standardLabel}</span>
      </h2>

      {scopeList.length === 0 ? (
        <p className="text-gray-500 text-sm italic">
          Tidak ada data scope tersedia.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
          {scopeList.map((item, index) => (
            <Badge
              key={index}
              variant="outline"
              className="w-full text-left whitespace-normal break-words py-3 px-4 bg-gray-50 hover:bg-primary/10 transition-colors text-sm font-medium rounded-xl shadow-sm border border-gray-200"
            >
              <div className="leading-snug text-gray-800" title={item}>
                {item}
              </div>
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
};
