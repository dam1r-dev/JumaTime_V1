"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { locales } from "@/i18n/routing";
import { auth } from "@/auth";
import { CATEGORIES } from "./categories";

export type ContentFormState = { error?: string } | undefined;

const contentSchema = z.object({
  category: z.enum(CATEGORIES),
  order: z.coerce.number().int().min(0),
  published: z.boolean(),
});

function extractTranslations(formData: FormData) {
  return locales
    .map((locale) => ({
      locale,
      title: (formData.get(`title_${locale}`) as string | null)?.trim() ?? "",
      body: (formData.get(`body_${locale}`) as string | null)?.trim() ?? "",
    }))
    .filter((t) => t.title.length > 0 && t.body.length > 0);
}

export async function createContentBlock(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const parsed = contentSchema.safeParse({
    category: formData.get("category"),
    order: formData.get("order") || "0",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  const translations = extractTranslations(formData);
  if (translations.length === 0) {
    return { error: "Заполните хотя бы один язык (заголовок и текст)" };
  }

  await prisma.contentBlock.create({
    data: {
      mosqueId: session.user.mosqueId,
      category: parsed.data.category,
      order: parsed.data.order,
      published: parsed.data.published,
      translations: { create: translations },
    },
  });

  revalidatePath("/admin/content");
  redirect("/admin/content");
}

export async function updateContentBlock(
  id: string,
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const owned = await prisma.contentBlock.findFirst({
    where: { id, mosqueId: session.user.mosqueId },
  });
  if (!owned) {
    return { error: "Материал не найден" };
  }

  const parsed = contentSchema.safeParse({
    category: formData.get("category"),
    order: formData.get("order") || "0",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  const translations = extractTranslations(formData);
  if (translations.length === 0) {
    return { error: "Заполните хотя бы один язык (заголовок и текст)" };
  }

  await prisma.$transaction([
    prisma.contentTranslation.deleteMany({ where: { contentBlockId: id } }),
    prisma.contentBlock.update({
      where: { id },
      data: {
        category: parsed.data.category,
        order: parsed.data.order,
        published: parsed.data.published,
        translations: { create: translations },
      },
    }),
  ]);

  revalidatePath("/admin/content");
  redirect("/admin/content");
}

export async function deleteContentBlock(id: string) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  await prisma.contentBlock.deleteMany({ where: { id, mosqueId: session.user.mosqueId } });
  revalidatePath("/admin/content");
  redirect("/admin/content");
}
