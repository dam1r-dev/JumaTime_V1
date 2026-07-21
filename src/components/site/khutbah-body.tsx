"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const FONT_SIZES_PX = [16, 18, 20, 22, 24, 28, 32];
const DEFAULT_SIZE_INDEX = 2;
const STORAGE_KEY = "jumma-time:khutbah-font-size-index";
const listeners = new Set<() => void>();

function readSizeIndex(): number {
  if (typeof window === "undefined") return DEFAULT_SIZE_INDEX;
  const stored = Number(window.localStorage.getItem(STORAGE_KEY));
  return Number.isInteger(stored) && stored >= 0 && stored < FONT_SIZES_PX.length
    ? stored
    : DEFAULT_SIZE_INDEX;
}

let cachedIndex = readSizeIndex();

function setSizeIndex(index: number) {
  cachedIndex = Math.min(FONT_SIZES_PX.length - 1, Math.max(0, index));
  window.localStorage.setItem(STORAGE_KEY, String(cachedIndex));
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return cachedIndex;
}

function getServerSnapshot() {
  return DEFAULT_SIZE_INDEX;
}

export function KhutbahBody({
  text,
  labels,
}: {
  text: string;
  labels: { decrease: string; increase: string };
}) {
  const sizeIndex = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div>
      <div className="mb-4 flex items-center gap-1.5 print:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={labels.decrease}
          disabled={sizeIndex === 0}
          onClick={() => setSizeIndex(sizeIndex - 1)}
        >
          <span className="text-xs font-semibold">A−</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={labels.increase}
          disabled={sizeIndex === FONT_SIZES_PX.length - 1}
          onClick={() => setSizeIndex(sizeIndex + 1)}
        >
          <span className="text-base font-semibold">A+</span>
        </Button>
      </div>
      <div
        className="prose prose-neutral max-w-none whitespace-pre-wrap leading-relaxed print:text-black print:leading-loose"
        style={{ fontSize: `${FONT_SIZES_PX[sizeIndex]}px` }}
      >
        {text}
      </div>
    </div>
  );
}
