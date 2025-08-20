import { z } from "zod";
import { createTRPCRouter, protectedProcedure, baseProcedure } from "../init";
import { db } from "@/lib/db";
import { partners } from "@/lib/schema/partner-schema";
import { eq, count, or, ilike } from "drizzle-orm";

export const partnersRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, search } = input;
      const offset = (page - 1) * limit;

      // Build where condition for search
      const searchCondition = search
        ? or(
            ilike(partners.name, `%${search}%`),
            ilike(partners.displayName, `%${search}%`),
            ilike(partners.email, `%${search}%`),
            ilike(partners.phone, `%${search}%`),
            ilike(partners.vat, `%${search}%`)
          )
        : undefined;

      // Get total count for pagination info
      const [totalCount] = await db
        .select({ count: count() })
        .from(partners)
        .where(searchCondition);

      // Get paginated partners
      const partnersList = await db
        .select()
        .from(partners)
        .where(searchCondition)
        .limit(limit)
        .offset(offset)
        .orderBy(partners.id);

      const totalPages = Math.ceil(totalCount.count / limit);

      return {
        partners: partnersList,
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
      const partner = await db
        .select()
        .from(partners)
        .where(eq(partners.id, input.id))
        .limit(1);

      if (partner.length === 0) {
        return null;
      }

      return partner[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z
          .object({
            username: z.string().optional(),
            password: z.string().optional(),
          })
          .partial(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, data } = input;

      const updatedPartner = await db
        .update(partners)
        .set({
          ...data,
        })
        .where(eq(partners.id, id))
        .returning();

      if (updatedPartner.length === 0) {
        throw new Error("Partner not found");
      }

      return updatedPartner[0];
    }),
});
