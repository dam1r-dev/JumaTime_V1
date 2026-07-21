import { redirect } from "next/navigation";
import NextLink from "next/link";
import { BookOpen, LayoutDashboard, ListChecks, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { logoutAction } from "./actions";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // A session minted before mosqueId was added to the JWT (or a stale/invalid one)
  // won't have it — treat that the same as logged out rather than crashing below.
  if (!session || !session.user.mosqueId) redirect("/admin/login");

  const mosque = await prisma.mosque.findUnique({ where: { id: session.user.mosqueId } });

  const links = [
    { href: "/admin", label: "Обзор", icon: LayoutDashboard },
    { href: "/admin/khutbahs", label: "Хутбы", icon: BookOpen },
    { href: "/admin/content", label: "Разделы сайта", icon: ListChecks },
  ];

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col justify-between bg-[var(--jt-green-950)] px-4 py-6 text-white lg:w-64">
        <div>
          <NextLink href="/admin" className="block px-2">
            <Logo className="text-white" />
          </NextLink>
          {mosque && (
            <p className="mt-2 truncate px-2 text-xs text-white/60">
              Мечеть: <span className="text-white/90">{mosque.name}</span>
            </p>
          )}
          <nav className="mt-8 flex flex-row gap-1 lg:flex-col">
            {links.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                <link.icon className="size-4" />
                {link.label}
              </NextLink>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex items-center justify-between gap-2 border-t border-white/10 pt-4 text-sm text-white/70">
          <span className="truncate">{session.user.email}</span>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Выйти"
            >
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </aside>
      <div className="flex-1 bg-muted/30 p-6 lg:p-10">{children}</div>
    </div>
  );
}
