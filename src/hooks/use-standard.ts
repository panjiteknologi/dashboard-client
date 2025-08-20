import { createQueryHook } from "@/lib/create-api-hooks";
import { dataStandard } from "@/services/list-standard";

const dataStandardKey = {
  standards: () => ["standards"] as const,
};

export const useDataStandardQuery = createQueryHook(
  dataStandardKey.standards,
  dataStandard.getListStandard
);
