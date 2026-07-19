"use client";

import { useSyncExternalStore } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getSavedSlugsSnapshot,
  getServerSavedSlugsSnapshot,
  subscribeSavedSlugs,
  toggleSavedSlug,
} from "@/lib/saved-khutbahs";

export function SaveKhutbahButton({
  slug,
  labels,
}: {
  slug: string;
  labels: { save: string; unsave: string; savedToast: string; unsavedToast: string };
}) {
  const slugs = useSyncExternalStore(
    subscribeSavedSlugs,
    getSavedSlugsSnapshot,
    getServerSavedSlugsSnapshot
  );
  const saved = slugs.includes(slug);

  function handleClick() {
    const result = toggleSavedSlug(slug);
    toast(result.saved ? labels.savedToast : labels.unsavedToast);
  }

  return (
    <Button
      variant={saved ? "default" : "outline"}
      onClick={handleClick}
      className={saved ? "bg-[var(--jt-green-900)] hover:bg-[var(--jt-green-800)]" : undefined}
    >
      {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
      {saved ? labels.unsave : labels.save}
    </Button>
  );
}
