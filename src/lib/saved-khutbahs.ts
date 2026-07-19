const STORAGE_KEY = "jumma-time:saved-khutbahs";
const SERVER_SNAPSHOT: string[] = [];
const listeners = new Set<() => void>();

function readSlugsFromStorage(): string[] {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

let cachedSlugs = readSlugsFromStorage();

function notify() {
  cachedSlugs = readSlugsFromStorage();
  for (const listener of listeners) listener();
}

/** For useSyncExternalStore: must return a referentially stable value until it actually changes. */
export function getSavedSlugsSnapshot(): string[] {
  return cachedSlugs;
}

export function getServerSavedSlugsSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

export function subscribeSavedSlugs(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = () => notify();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSavedSlugs(): string[] {
  return readSlugsFromStorage();
}

export function isSlugSaved(slug: string): boolean {
  return cachedSlugs.includes(slug);
}

export function toggleSavedSlug(slug: string): { saved: boolean; slugs: string[] } {
  const current = readSlugsFromStorage();
  const saved = !current.includes(slug);
  const next = saved ? [...current, slug] : current.filter((s) => s !== slug);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  notify();
  return { saved, slugs: next };
}
