import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { KhutbahForm } from "../khutbah-form";
import { updateKhutbah, deleteKhutbah } from "../actions";
import { Button } from "@/components/ui/button";

export default async function EditKhutbahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const khutbah = await prisma.khutbah.findFirst({
    where: { id, mosqueId: session!.user.mosqueId },
    include: { translations: true },
  });

  if (!khutbah) notFound();

  const boundUpdate = updateKhutbah.bind(null, id);
  const boundDelete = deleteKhutbah.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Редактировать хутбу</h1>
        <form action={boundDelete}>
          <Button type="submit" variant="destructive">
            Удалить
          </Button>
        </form>
      </div>
      <div className="mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6">
        <KhutbahForm
          action={boundUpdate}
          initial={{
            slug: khutbah.slug,
            date: khutbah.date.toISOString().slice(0, 10),
            published: khutbah.published,
            originalLocale: khutbah.originalLocale,
            translations: khutbah.translations,
          }}
        />
      </div>
    </div>
  );
}
