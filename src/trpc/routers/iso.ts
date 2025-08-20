import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { tsiIso } from "@/lib/schema/iso-schema";
import { eq, count } from "drizzle-orm";

export const isoRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;

      // Get total count for pagination info
      const [totalCount] = await db.select({ count: count() }).from(tsiIso);
      
      // Get paginated ISO records
      const isoRecords = await db
        .select()
        .from(tsiIso)
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(totalCount.count / limit);

      return {
        isoRecords,
        pagination: {
          page,
          limit,
          total: totalCount.count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const isoRecord = await db
        .select()
        .from(tsiIso)
        .where(eq(tsiIso.id, input.id))
        .limit(1);

      if (isoRecord.length === 0) {
        return null;
      }

      return isoRecord[0];
    }),
});