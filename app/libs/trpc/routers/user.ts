import { z } from "zod";
import { procedure, router } from "../trpc";
import { getUsers } from "~/libs/db/queries";
import type { PermissionEnum } from "~/libs/db/schema";

export const userRouter = router({
  hq: {
    get: procedure
      .input(
        z.object({
          page: z.number().default(0),
          limit: z.number().default(10),
          permissions: z.array(z.string()).default([]),
          name: z.string().optional(),
          username: z.string().optional(),
          email: z.string().optional(),
          orders: z
            .object({
              createdAt: z.enum(["desc", "asc"]).optional(),
            })
            .default({
              createdAt: undefined,
            }),
        })
      )
      .query(async ({ ctx, input }) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return getUsers({
          limit: input.limit,
          offset: input.limit * input.page,
          permissions: input.permissions as PermissionEnum[],
          email: input.email,
          firstName: input.name,
          lastName: input.name,
          username: input.username,
          orders: input.orders,
        });
      }),
  },
});
