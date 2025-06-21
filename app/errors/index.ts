import { TRPCError } from "@trpc/server";

export class ClientError extends TRPCError {}

export class InvalidCredentialsError extends ClientError {
  constructor() {
    super({
      code: "BAD_REQUEST",
      message: "Invalid user credentials",
    });
  }
}

export class CannotQuitNonExistingImpersonationSessionError extends ClientError {
  constructor() {
    super({
      code: "BAD_REQUEST",
      message: "Cannot quit non existing impersonation session",
    });
  }
}

export class CannotImpersonateYourselfError extends ClientError {
  constructor() {
    super({
      code: "BAD_REQUEST",
      message: "Cannot impersonate yourself",
    });
  }
}

export class IllegalImpersonationError extends ClientError {
  constructor() {
    super({
      code: "BAD_REQUEST",
      message: "Illegal impersonation",
    });
  }
}
