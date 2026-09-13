import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { SermonForm } from "../sermon-form";
import { updateSermon, deleteSermon } from "../actions";
import { Button } from "@/components/ui/button";
import { toFormPublishState } from "@/lib/published";

export default async function EditSermonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const sermon = await prisma.sermon.findFirst({
    where: { id, mosqueId: session!.user.mosqueId },
    include: { translations: true },
  });

  if (!sermon) notFound();

  const boundUpdate = updateSermon.bind(null, id);
  const boundDelete = deleteSermon.bind(null, id);
  const { status: publishStatus, scheduledFor } = toFormPublishState(sermon.publishedAt);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Редактировать проповедь</h1>
        <form action={boundDelete}>
          <Button type="submit" variant="destructive">
            Удалить
          </Button>
        </form>
      </div>
      <div className="mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6">
        <SermonForm
          action={boundUpdate}
          initial={{
            slug: sermon.slug,
            date: sermon.date.toISOString().slice(0, 10),
            publishStatus,
            scheduledFor,
            originalLocale: sermon.originalLocale,
            translations: sermon.translations,
          }}
        />
      </div>
    </div>
  );
}
