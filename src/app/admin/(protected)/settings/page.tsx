import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const session = await auth();
  const mosque = await prisma.mosque.findUnique({ where: { id: session!.user.mosqueId } });
  if (!mosque) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Настройки мечети</h1>
      <p className="mt-1 text-muted-foreground">
        Логотип показывается на главной странице сайта рядом с названием мечети.
      </p>
      <div className="mt-6 max-w-lg rounded-2xl border border-border bg-card p-6">
        <SettingsForm mosqueName={mosque.name} initialLogoUrl={mosque.logoUrl ?? ""} />
      </div>
    </div>
  );
}
