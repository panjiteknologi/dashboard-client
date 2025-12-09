"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegulationDetailView } from "@/views/apps/library/regulation/regulation-detail";
import { RegulationType } from "@/types/projects";

type RegulationPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regulationId: Id<"regulations"> | null;
};

export function RegulationPreviewDialog({
  open,
  onOpenChange,
  regulationId,
}: RegulationPreviewDialogProps) {
  const regulation = useQuery(
    api.regulations.get,
    regulationId ? { id: regulationId } : "skip"
  );

  const imageUrl = useQuery(
    api.regulations.getImageUrl,
    regulation?.imageStorageId ? { storageId: regulation.imageStorageId } : "skip"
  );

  // Transform Convex regulation to RegulationType
  const transformedRegulation: RegulationType | null = regulation
    ? {
        id: regulation.id,
        title: regulation.title,
        subtitle: regulation.subtitle,
        image: imageUrl || regulation.image || "",
        number: regulation.number,
        type: regulation.type,
        issuer: regulation.issuer,
        sector: regulation.sector,
        jurisdiction: regulation.jurisdiction,
        status: regulation.status,
        publishedAt: regulation.publishedAt,
        effectiveAt: regulation.effectiveAt,
        summary: regulation.summary,
        keywords: regulation.keywords,
        sourceUrl: regulation.sourceUrl,
        attachments: regulation.attachments,
        sections: regulation.sections,
        relatedRegulations: regulation.relatedRegulations,
      }
    : null;

  if (!transformedRegulation) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-none max-h-[90vh] overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Regulation</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <RegulationDetailView regulation={transformedRegulation} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

