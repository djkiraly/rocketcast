/**
 * Pure routing helpers for the realtime worker. No runtime dependencies so they can be
 * unit-tested under plain Node Vitest without the workers runtime.
 */

/** Session ids are ULIDs in production (SPEC §7); allow a conservative URL-safe charset. */
const SESSION_PATH = /^\/session\/([A-Za-z0-9_-]{1,128})\/?$/;

/**
 * Returns the session id for `GET /session/:id` paths, or `null` when the path does not match.
 * A trailing slash is tolerated; nested paths and empty ids are not.
 */
export function matchSessionPath(pathname: string): string | null {
  const match = SESSION_PATH.exec(pathname);
  return match?.[1] ?? null;
}
