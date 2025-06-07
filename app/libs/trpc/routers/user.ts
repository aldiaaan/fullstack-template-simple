import { z } from "zod";
import { procedure, router } from "../trpc";
import { getUsers } from "~/libs/db/queries";
import type { PermissionEnum } from "~/libs/db/schema";
import { deleteUsers } from "~/libs/db/mutations";

export const userRouter = router({
  hq: {
    delete: procedure
      .input(z.string().array())
      .mutation(async ({ ctx, input }) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await deleteUsers(input);
      }),
    get: procedure
      .input(
        z.object({
          page: z.number().default(0),
          limit: z.number().default(10),
          filters: z
            .object({
              permissions: z.array(z.string()).default([]),
              name: z.string().optional(),
              username: z.string().optional(),
              email: z.string().optional(),
            })
            .default({}),
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
          permissions: input.filters.permissions as PermissionEnum[],
          email: input.filters.email,
          firstName: input.filters.name,
          lastName: input.filters.name,
          username: input.filters.username,
          orders: input.orders,
        });
      }),
  },
});
