import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentForm } from "../content-form";
import { updateContentBlock, deleteContentBlock } from "../actions";
import { Button } from "@/components/ui/button";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const block = await prisma.contentBlock.findUnique({
    where: { id },
    include: { translations: true },
  });

  if (!block) notFound();

  const boundUpdate = updateContentBlock.bind(null, id);
  const boundDelete = deleteContentBlock.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Редактировать материал</h1>
        <form action={boundDelete}>
          <Button type="submit" variant="destructive">
            Удалить
          </Button>
        </form>
      </div>
      <div className="mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6">
        <ContentForm
          action={boundUpdate}
          initial={{
            category: block.category,
            order: block.order,
            published: block.published,
            translations: block.translations,
          }}
        />
      </div>
    </div>
  );
}
