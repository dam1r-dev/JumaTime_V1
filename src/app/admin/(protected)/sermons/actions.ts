"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { locales } from "@/i18n/routing";
import { auth } from "@/auth";
import { resolvePublishedAtFromForm } from "@/lib/published";

export type SermonFormState = { error?: string } | undefined;

const sermonSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Укажите URL (slug)")
    .regex(/^[a-z0-9-]+$/, "Только латиница, цифры и дефис"),
  date: z.string().min(1, "Укажите дату"),
  originalLocale: z.enum(locales),
});

function extractTranslations(formData: FormData) {
  return locales
    .map((locale) => ({
      locale,
      title: (formData.get(`title_${locale}`) as string | null)?.trim() ?? "",
      summary: (formData.get(`summary_${locale}`) as string | null)?.trim() ?? "",
      body: (formData.get(`body_${locale}`) as string | null)?.trim() ?? "",
    }))
    .filter((t) => t.title.length > 0 && t.body.length > 0);
}

export async function createSermon(
  _prevState: SermonFormState,
  formData: FormData
): Promise<SermonFormState> {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const parsed = sermonSchema.safeParse({
    slug: formData.get("slug"),
    date: formData.get("date"),
    originalLocale: formData.get("originalLocale"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  const publishResult = resolvePublishedAtFromForm(
    formData.get("publishStatus"),
    formData.get("scheduledFor")
  );
  if ("error" in publishResult) {
    return { error: publishResult.error };
  }

  const translations = extractTranslations(formData);
  if (translations.length === 0) {
    return { error: "Заполните хотя бы один язык (заголовок и текст)" };
  }

  const existing = await prisma.sermon.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "Проповедь с таким URL уже существует" };
  }

  await prisma.sermon.create({
    data: {
      mosqueId: session.user.mosqueId,
      slug: parsed.data.slug,
      date: new Date(parsed.data.date),
      publishedAt: publishResult.publishedAt,
      originalLocale: parsed.data.originalLocale,
      translations: { create: translations },
    },
  });

  revalidatePath("/admin/sermons");
  redirect("/admin/sermons");
}

export async function updateSermon(
  id: string,
  _prevState: SermonFormState,
  formData: FormData
): Promise<SermonFormState> {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const owned = await prisma.sermon.findFirst({
    where: { id, mosqueId: session.user.mosqueId },
  });
  if (!owned) {
    return { error: "Проповедь не найдена" };
  }

  const parsed = sermonSchema.safeParse({
    slug: formData.get("slug"),
    date: formData.get("date"),
    originalLocale: formData.get("originalLocale"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  const publishResult = resolvePublishedAtFromForm(
    formData.get("publishStatus"),
    formData.get("scheduledFor")
  );
  if ("error" in publishResult) {
    return { error: publishResult.error };
  }

  const translations = extractTranslations(formData);
  if (translations.length === 0) {
    return { error: "Заполните хотя бы один язык (заголовок и текст)" };
  }

  const conflict = await prisma.sermon.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) {
    return { error: "Проповедь с таким URL уже существует" };
  }

  await prisma.$transaction([
    prisma.sermonTranslation.deleteMany({ where: { sermonId: id } }),
    prisma.sermon.update({
      where: { id },
      data: {
        slug: parsed.data.slug,
        date: new Date(parsed.data.date),
        publishedAt: publishResult.publishedAt,
        originalLocale: parsed.data.originalLocale,
        translations: { create: translations },
      },
    }),
  ]);

  revalidatePath("/admin/sermons");
  redirect("/admin/sermons");
}

export async function deleteSermon(id: string) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  await prisma.sermon.deleteMany({ where: { id, mosqueId: session.user.mosqueId } });
  revalidatePath("/admin/sermons");
  redirect("/admin/sermons");
}
