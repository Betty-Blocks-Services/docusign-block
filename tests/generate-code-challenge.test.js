import sha256 from "js-sha256";
import { base64UrlEncode } from "../functions/utils";
import { generateCodeChallenge } from "../functions/utils";

describe("generateCodeChallenge", () => {
  test("should generate a valid code_verifier", async () => {
    const { codeVerifier } = await generateCodeChallenge();
    expect(codeVerifier).toBeDefined();
    expect(typeof codeVerifier).toBe("string");
    expect(codeVerifier.length).toBeGreaterThan(0);
    expect(codeVerifier).toMatch(/^[A-Za-z0-9-_]+$/); // Base64URL format
  });

  test("should generate a valid code_challenge", async () => {
    const { _, codeChallenge } = await generateCodeChallenge();
    expect(codeChallenge).toBeDefined();
    expect(typeof codeChallenge).toBe("string");
    expect(codeChallenge.length).toBeGreaterThan(0);
    expect(codeChallenge).toMatch(/^[A-Za-z0-9-_]+$/); // Base64URL format
  });

  test("should correctly derive code_challenge from code_verifier using SHA-256", async () => {
    const { codeVerifier, codeChallenge } = await generateCodeChallenge();

    // Hash manually using js-sha256
    const expectedHashBuffer = sha256.arrayBuffer(codeVerifier);
    const expectedCodeChallenge = base64UrlEncode(expectedHashBuffer);

    expect(codeChallenge).toBe(expectedCodeChallenge);
  });

  test("should generate different code_verifier values on multiple calls", async () => {
    const { codeVerifier: verifier1 } = await generateCodeChallenge();
    const { codeVerifier: verifier2 } = await generateCodeChallenge();
    expect(verifier1).not.toBe(verifier2); // Ensure randomness
  });

  test("should generate code_verifier of specified length", async () => {
    const length = 128;
    const { codeVerifier } = await generateCodeChallenge(length);
    expect(codeVerifier.length).toBeGreaterThanOrEqual(length);
  });
});
