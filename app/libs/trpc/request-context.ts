import { authSessionStorage } from "~/sessions/auth";
import { getRandomToken } from "~/utils/random";
import { validateSessionToken } from "../auth/validate-session-token";

type User = {
  email: string;
  id: string;
  firstName: string;
  lastName: string | null;
};

export type RequestContextArgs = {
  id: string;
  request: Request;
  headers: Headers;
  user?: User;
};

export class RequestContext {
  id: string;
  request: Request;
  headers: Headers;
  user?: User;

  constructor(args: RequestContextArgs) {
    this.id = args.id;
    this.request = args.request;
    this.headers = args.headers;
    this.user = args.user;
  }

  toJSON() {
    return {
      id: this.id,
      user: this.user,
    };
  }

  static async fromRequest(request: Request, headers: Headers) {
    const authSession = await authSessionStorage.getSession(
      headers.get("Cookie")
    );

    const authToken = authSession.data.token;

    let user: User | undefined;

    if (authToken) {
      const validationResult = await validateSessionToken(authToken);

      if (validationResult) {
        user = validationResult.user;
      }
    }

    return new this({
      id: getRandomToken(12),
      headers,
      request,
      user,
    });
  }
}
