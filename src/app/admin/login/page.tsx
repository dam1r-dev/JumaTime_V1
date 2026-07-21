import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/lib/auth-actions";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  // A session cookie minted before mosqueId existed on the JWT (or otherwise
  // invalid) must NOT count as logged in here, or this page and the /admin
  // layout redirect to each other forever (layout sends it back here).
  if (session && session.user.mosqueId) redirect("/admin");

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
              Найдена старая сессия ({session.user.email}) без привязки к мечети — нужно
              выйти и войти заново.
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
