import crypto from "crypto";

/**
 * Length of the generated token in bytes (32 bytes = 64 hex characters)
 */
const TOKEN_BYTE_LENGTH = 32;

/**
 * Result of generating a new webhook token
 */
export type GenerateTokenResult = {
  /** The plain text token (only shown once to the user) */
  token: string;
  /** The hashed token for secure storage */
  tokenHash: string;
  /** Last 4 characters of the token for display purposes */
  tokenLast4: string;
};

/**
 * Generate a secure random webhook token
 *
 * This function creates a cryptographically secure random token using Node.js crypto.randomBytes.
 * The token is hashed using better-auth's hashPassword function (bcrypt-based) for secure storage.
 *
 * @returns An object containing the plain token (show once), hash (for storage), and last 4 chars (for display)
 *
 * @example
 * const { token, tokenHash, tokenLast4 } = await generateWebhookToken();
 * // token: "a1b2c3d4..." (64 char hex string) - show to user once
 * // tokenHash: "$2b$..." (bcrypt hash) - store in database
 * // tokenLast4: "c3d4" - display in UI for identification
 */
export async function generateWebhookToken(): Promise<GenerateTokenResult> {
  // Generate cryptographically secure random bytes
  const tokenBuffer = crypto.randomBytes(TOKEN_BYTE_LENGTH);

  // Convert to hex string (64 characters for 32 bytes)
  const token = tokenBuffer.toString("hex");

  // Extract last 4 characters for display
  const tokenLast4 = token.slice(-4);

  // Hash the token using better-auth's password hashing (bcrypt-based)
  const { hashPassword } = await import("better-auth/crypto");
  const tokenHash = await hashPassword(token);

  return {
    token,
    tokenHash,
    tokenLast4,
  };
}

/**
 * Validate a webhook token against a stored hash
 *
 * This function securely compares a plain text token against its stored bcrypt hash.
 * Uses constant-time comparison to prevent timing attacks.
 *
 * @param token - The plain text token to validate
 * @param storedHash - The bcrypt hash stored in the database
 * @returns True if the token matches the hash, false otherwise
 *
 * @example
 * const isValid = await validateWebhookToken(incomingToken, webhook.tokenHash);
 * if (!isValid) {
 *   throw new Error("Invalid webhook token");
 * }
 */
export async function validateWebhookToken(
  token: string,
  storedHash: string
): Promise<boolean> {
  // Use better-auth's password verification (bcrypt-based)
  const { verifyPassword } = await import("better-auth/crypto");
  return verifyPassword({ password: token, hash: storedHash });
}

/**
 * Extract the Bearer token from an Authorization header
 *
 * @param authHeader - The Authorization header value (e.g., "Bearer abc123...")
 * @returns The extracted token or null if invalid format
 *
 * @example
 * const token = extractBearerToken(request.headers.get("authorization"));
 * if (!token) {
 *   return new Response("Missing or invalid authorization header", { status: 401 });
 * }
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  // Check for Bearer prefix (case-insensitive)
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!bearerMatch || !bearerMatch[1]) {
    return null;
  }

  return bearerMatch[1];
}

/**
 * Validate a webhook request's authorization
 *
 * This is a convenience function that extracts the Bearer token from the Authorization header
 * and validates it against the stored hash.
 *
 * @param authHeader - The Authorization header from the incoming request
 * @param storedHash - The bcrypt hash stored in the database
 * @returns True if the request is authorized, false otherwise
 *
 * @example
 * const isAuthorized = await validateWebhookRequest(
 *   request.headers.get("authorization"),
 *   webhook.tokenHash
 * );
 * if (!isAuthorized) {
 *   return new Response("Unauthorized", { status: 401 });
 * }
 */
export async function validateWebhookRequest(
  authHeader: string | null,
  storedHash: string
): Promise<boolean> {
  const token = extractBearerToken(authHeader);
  if (!token) {
    return false;
  }

  return validateWebhookToken(token, storedHash);
}
