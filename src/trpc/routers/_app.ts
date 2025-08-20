import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { usersRouter } from "./users";
import { isoRouter } from "./iso";
import { partnersRouter } from "./partners";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(async (opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  users: usersRouter,
  iso: isoRouter,
  partners: partnersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
