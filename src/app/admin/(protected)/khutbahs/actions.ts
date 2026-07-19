"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { locales } from "@/i18n/routing";

export type KhutbahFormState = { error?: string } | undefined;

const khutbahSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Укажите URL (slug)")
    .regex(/^[a-z0-9-]+$/, "Только латиница, цифры и дефис"),
  date: z.string().min(1, "Укажите дату"),
  published: z.boolean(),
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

export async function createKhutbah(
  _prevState: KhutbahFormState,
  formData: FormData
): Promise<KhutbahFormState> {
  const parsed = khutbahSchema.safeParse({
    slug: formData.get("slug"),
    date: formData.get("date"),
    published: formData.get("published") === "on",
    originalLocale: formData.get("originalLocale"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  const translations = extractTranslations(formData);
  if (translations.length === 0) {
    return { error: "Заполните хотя бы один язык (заголовок и текст)" };
  }

  const existing = await prisma.khutbah.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "Хутба с таким URL уже существует" };
  }

  await prisma.khutbah.create({
    data: {
      slug: parsed.data.slug,
      date: new Date(parsed.data.date),
      published: parsed.data.published,
      originalLocale: parsed.data.originalLocale,
      translations: { create: translations },
    },
  });

  revalidatePath("/admin/khutbahs");
  redirect("/admin/khutbahs");
}

export async function updateKhutbah(
  id: string,
  _prevState: KhutbahFormState,
  formData: FormData
): Promise<KhutbahFormState> {
  const parsed = khutbahSchema.safeParse({
    slug: formData.get("slug"),
    date: formData.get("date"),
    published: formData.get("published") === "on",
    originalLocale: formData.get("originalLocale"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  const translations = extractTranslations(formData);
  if (translations.length === 0) {
    return { error: "Заполните хотя бы один язык (заголовок и текст)" };
  }

  const conflict = await prisma.khutbah.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) {
    return { error: "Хутба с таким URL уже существует" };
  }

  await prisma.$transaction([
    prisma.khutbahTranslation.deleteMany({ where: { khutbahId: id } }),
    prisma.khutbah.update({
      where: { id },
      data: {
        slug: parsed.data.slug,
        date: new Date(parsed.data.date),
        published: parsed.data.published,
        originalLocale: parsed.data.originalLocale,
        translations: { create: translations },
      },
    }),
  ]);

  revalidatePath("/admin/khutbahs");
  redirect("/admin/khutbahs");
}

export async function deleteKhutbah(id: string) {
  await prisma.khutbah.delete({ where: { id } });
  revalidatePath("/admin/khutbahs");
  redirect("/admin/khutbahs");
}
