export class ClientError extends Error {}

export class InvalidCredentialsError extends ClientError {
  constructor() {
    super("Invalid user credentials");
  }
}
