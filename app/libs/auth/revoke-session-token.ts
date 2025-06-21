import { deleteAuthenticatedSession } from "../db/mutations";
import { tokenForSessionId } from "./token-for-session-id";

export async function revokeSessionToken(token: string) {
  const sessionId = tokenForSessionId(token);

  await deleteAuthenticatedSession(sessionId);
}
