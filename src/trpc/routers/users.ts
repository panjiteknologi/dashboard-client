import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { resUsers } from "@/lib/schema/user-schema";
import { eq, count } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
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
      const [totalCount] = await db.select({ count: count() }).from(resUsers);
      
      // Get paginated users
      const users = await db
        .select()
        .from(resUsers)
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(totalCount.count / limit);

      return {
        users,
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
      const user = await db
        .select()
        .from(resUsers)
        .where(eq(resUsers.id, input.id))
        .limit(1);

      if (user.length === 0) {
        return null;
      }

      return user[0];
    }),
});
