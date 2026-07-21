import type { Session } from "next-auth";

/**
 * Bump this whenever a required field is added to (or removed from)
 * `session.user`. A JWT cookie signed under an older version is then
 * treated as logged-out everywhere instead of causing a crash or a
 * redirect loop between pages that disagree about what the session
 * shape looks like.
 *
 * History: 1 — initial (id, email, name). 2 — added mosqueId (multi-mosque).
 */
export const SESSION_VERSION = 2;

export function isSessionValid(
  session: Session | null
): session is Session & { version: number; user: { mosqueId: string } } {
  return (
    !!session &&
    session.version === SESSION_VERSION &&
    typeof session.user.mosqueId === "string" &&
    session.user.mosqueId.length > 0
  );
}
