const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000;
// An attacker can submit arbitrary/never-reused emails to grow this map
// forever (it only ever deletes an entry on a *successful* login for that
// exact email) — a slow memory-exhaustion DoS against the process itself.
// Once we're tracking more distinct emails than real admins could ever
// account for, sweep out anything idle past the block window instead of
// letting the map grow unbounded.
const MAX_TRACKED_EMAILS = 5000;

type Entry = { failures: number; blockedUntil: number | null; lastAttempt: number };

// In-memory — resets on server restart and isn't shared across serverless
// instances. Fine for a single long-running Node process (local dev, a
// traditional server, or Vercel with a single warm instance); once this
// deploys behind multiple serverless instances, swap for something shared
// like Upstash Redis (@upstash/ratelimit) so attempts are counted globally.
const attempts = new Map<string, Entry>();

function keyFor(email: string) {
  return email.trim().toLowerCase();
}

function sweepStaleEntries() {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    const idleFor = now - entry.lastAttempt;
    const stillBlocked = entry.blockedUntil !== null && entry.blockedUntil > now;
    if (!stillBlocked && idleFor > BLOCK_MS) {
      attempts.delete(key);
    }
  }
}

/** Returns remaining block time in ms, or 0 if not currently blocked. */
export function getBlockedMs(email: string): number {
  const entry = attempts.get(keyFor(email));
  if (!entry?.blockedUntil) return 0;
  const remaining = entry.blockedUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

export function recordFailedLogin(email: string): void {
  if (attempts.size >= MAX_TRACKED_EMAILS) {
    sweepStaleEntries();
  }

  const key = keyFor(email);
  const entry = attempts.get(key) ?? { failures: 0, blockedUntil: null, lastAttempt: 0 };
  entry.failures += 1;
  entry.lastAttempt = Date.now();
  if (entry.failures >= MAX_ATTEMPTS) {
    entry.blockedUntil = Date.now() + BLOCK_MS;
    entry.failures = 0;
  }
  attempts.set(key, entry);
}

export function clearLoginAttempts(email: string): void {
  attempts.delete(keyFor(email));
}
