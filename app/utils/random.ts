import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export function getRandomToken(n: number = 24) {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}
