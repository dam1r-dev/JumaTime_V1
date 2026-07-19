"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButton({ title, label }: { title: string; label: string }) {
  async function handleClick() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled share sheet — no-op
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast(label);
  }

  return (
    <Button variant="outline" onClick={handleClick}>
      <Share2 className="size-4" />
      {label}
    </Button>
  );
}
