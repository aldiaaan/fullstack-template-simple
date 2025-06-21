import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

export function tokenForSessionId(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}
