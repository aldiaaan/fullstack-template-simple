import { authSessionStorage } from "~/sessions/auth";
import { getRandomToken } from "~/utils/random";
import { validateSessionToken } from "../auth/validate-session-token";

type User = {
  email: string;
  id: string;
  firstName: string;
  lastName?: string;
  username: string;
};

export type RequestContextArgs = {
  id: string;
  request: Request;
  headers: Headers;
  user?: User;
  authToken?: string;
};

export class RequestContext {
  id: string;
  request: Request;
  headers: Headers;
  user?: User;
  authToken?: string;

  constructor(args: RequestContextArgs) {
    this.id = args.id;
    this.request = args.request;
    this.headers = args.headers;
    this.user = args.user;
    this.authToken = args.authToken;
  }

  toJSON() {
    return {
      id: this.id,
      user: this.user,
      authToken: this.authToken,
    };
  }

  only = {
    allow: {
      loggedIn: () => {
        if (!this.user) throw new Error("You have to login");
      },
    },
  };

  static async fromRequest(request: Request, headers: Headers) {
    const authSession = await authSessionStorage.getSession(
      request.headers.get("Cookie")
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
      authToken,
    });
  }
}
