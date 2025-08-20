import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { resUsers } from "@/lib/schema/user-schema";
import { eq } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    const users = await db.select().from(resUsers);
    return users;
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
