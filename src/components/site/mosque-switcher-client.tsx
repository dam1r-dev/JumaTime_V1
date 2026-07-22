"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { setMosqueCookie } from "@/lib/mosque-actions";

type MosqueOption = { slug: string; name: string };

export function MosqueSwitcherClient({
  mosques,
  current,
  label,
}: {
  mosques: MosqueOption[];
  current: MosqueOption | null;
  label: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (mosques.length <= 1) return null;

  function onSelect(slug: string) {
    startTransition(async () => {
      await setMosqueCookie(slug);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-foreground"
            aria-label={label}
            disabled={pending}
          >
            <Building2 className="size-4" />
            <span className="hidden sm:inline">{current?.name ?? label}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {mosques.map((m) => (
          <DropdownMenuItem
            key={m.slug}
            onClick={() => onSelect(m.slug)}
            className={m.slug === current?.slug ? "font-semibold" : undefined}
          >
            {m.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
