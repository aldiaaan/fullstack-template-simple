import { z } from "zod";
import { procedure, router } from "../trpc";
import { createAccount } from "~/libs/auth/create-account";
import { createAuthenticatedSession } from "~/libs/auth/create-authenticated-session";
import { verifyUser } from "~/libs/auth/verify-user";
import { getRandomToken } from "~/utils/random";
import { authSessionStorage } from "~/sessions/auth";
import { InvalidCredentialsError } from "~/errors";
import { invalidateAuthenticatedSession } from "~/libs/db/mutations";
import { tokenForSessionId } from "~/libs/auth/token-for-session-id";

export const authRouter = router({
  logout: procedure.mutation(async ({ ctx }) => {
    if (ctx.authToken) {
      await invalidateAuthenticatedSession(tokenForSessionId(ctx.authToken));

      const session = await authSessionStorage.getSession(
        ctx.headers.get("Cookie")
      );

      ctx.headers.set(
        "Set-Cookie",
        await authSessionStorage.destroySession(session)
      );
    }
  }),
  login: procedure
    .input(
      z.object({
        password: z.string().min(8),
        email: z.string().min(1).email("This is not a valid email"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await verifyUser({
        email: input.email,
        password: input.password,
      });

      if (!user) throw new InvalidCredentialsError();

      const authenticatedSession = await createAuthenticatedSession(
        getRandomToken(24),
        user.id
      );

      const session = await authSessionStorage.getSession(
        ctx.headers.get("Cookie")
      );

      session.set("token", authenticatedSession.token);

      ctx.headers.set(
        "Set-Cookie",
        await authSessionStorage.commitSession(session)
      );
    }),
  register: procedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        password: z.string().min(8),
        email: z.string().min(1).email("This is not a valid email"),
      })
    )
    .mutation(async ({ input }) => {
      const account = await createAccount(input);

      return {
        id: account.id,
        email: account.email,
        username: account.username,
        firstName: account.firstName,
        lastName: account.lastName,
      };
    }),
});
