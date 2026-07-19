import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Logo } from "@/components/site/logo";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--jt-green-950)] px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[var(--jt-green-900)] p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-white">
          <Logo className="text-white" />
          <p className="text-sm text-white/60">Панель имама</p>
        </div>
        <div className="rounded-xl bg-white p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
