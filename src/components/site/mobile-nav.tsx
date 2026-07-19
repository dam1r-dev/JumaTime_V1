"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function MobileNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10 hover:text-white"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>
      {open && (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-[var(--jt-green-900)] px-4 py-3">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
