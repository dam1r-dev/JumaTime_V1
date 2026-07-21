import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/lib/auth-actions";
import { isSessionValid } from "@/lib/session-version";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  // A session must pass the same validity check as the /admin layout, or
  // this page and the layout redirect to each other forever for a session
  // that exists but is stale/outdated (see src/lib/session-version.ts).
  if (isSessionValid(session)) redirect("/admin");

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--jt-green-950)] px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[var(--jt-green-900)] p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-white">
          <Logo className="text-white" />
          <p className="text-sm text-white/60">Панель имама</p>
        </div>

        {session && (
          <div className="mb-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            <p>
              Найдена устаревшая сессия ({session.user.email}) — нужно выйти и войти заново.
            </p>
            <form action={logoutAction} className="mt-3">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-foreground"
              >
                <LogOut className="size-4" />
                Выйти
              </Button>
            </form>
          </div>
        )}

        <div className="rounded-xl bg-white p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
