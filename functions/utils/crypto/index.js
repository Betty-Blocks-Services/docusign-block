import sha256 from "js-sha256";
import { base64UrlEncode } from "../base64";

/**
 * Generates a cryptographically random string as the code_verifier
 * and derives the corresponding code_challenge using SHA-256 hashing and Base64URL encoding.
 *
 * @param {number} length - The length of the code_verifier (default: 64)
 * @returns {Promise<{ codeVerifier: string, codeChallenge: string }>}
 */
export async function generateCodeChallenge(length = 64) {
  const randomBytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256); // 8-bit random values
  }
  const codeVerifier = Buffer.from(randomBytes).toString("base64url"); // Base64URL encode directly

  const hashBuffer = sha256.arrayBuffer(codeVerifier);

  const codeChallenge = base64UrlEncode(hashBuffer);

  return { codeVerifier, codeChallenge };
}
