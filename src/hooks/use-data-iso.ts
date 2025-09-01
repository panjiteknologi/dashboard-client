import { createQueryHook } from "@/lib/create-api-hooks";
import { dataISOService } from "@/services/data-iso-api";

const dataISOKeys = {
  details: () => ["detail"] as const,
};

export const useDataISO = createQueryHook(
  dataISOKeys.details,
  dataISOService.getDataISO
);
