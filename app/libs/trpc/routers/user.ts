import { z } from "zod";
import { procedure, router } from "../trpc";
import {
  checkIfusernameExists,
  getAuthenticatedSession,
  getAuthenticatedSessions,
  getUserById,
  getUsers,
} from "~/libs/db/queries";
import type { PermissionEnum } from "~/libs/db/schema";
import {
  deleteAuthenticatedSession,
  deleteUserAuthenticatedSessions,
  deleteUsers,
  updateUserPassword,
  updateUserProfile,
} from "~/libs/db/mutations";
import { hash, verify } from "@node-rs/argon2";
import { sleep } from "~/utils/network";

export const userRouter = router({
  me: {
    updatePassword: procedure
      .input(
        z.object({
          currentPassword: z.string(),
          newPassword: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("You have to login");

        const user = await getUserById(ctx.user.id);

        if (!user) throw new Error("Cannot find user");

        const verified = await verify(user.password, input.currentPassword);

        if (!verified) throw new Error("Cannot verify credentials");
        // TODO: refactor this
        await updateUserPassword(
          ctx.user.id,
          await hash(input.newPassword, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
          })
        );
      }),
    updateProfile: procedure
      .input(
        z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          username: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("You have to login");

        const isUsernameChanged = input.username !== ctx.user.username;

        if (
          input.username &&
          isUsernameChanged &&
          (await checkIfusernameExists(input.username))
        )
          throw new Error(`'${input.username}' username already used.`);

        await updateUserProfile(ctx.user.id, input);
      }),
    deleteAllSessions: procedure.mutation(async ({ ctx }) => {
      if (ctx.user) {
        await deleteUserAuthenticatedSessions(ctx.user?.id);
      }
    }),
    sessions: procedure.query(async ({ ctx, input }) => {
      await sleep(5000);
      return getAuthenticatedSessions({
        userId: ctx.user?.id,
      });
    }),
    deleteSession: procedure
      .input(z.string())
      .mutation(async ({ input: sessionId, ctx }) => {
        const session = await getAuthenticatedSession(sessionId);
        if (session?.userId !== ctx.user?.id) throw new Error("Forbidden");
        await deleteAuthenticatedSession(sessionId);
      }),
  },
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
