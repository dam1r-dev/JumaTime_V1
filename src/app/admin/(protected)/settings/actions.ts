"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type SettingsFormState = { error?: string; success?: boolean } | undefined;

const settingsSchema = z.object({
  logoUrl: z.union([z.literal(""), z.url("Укажите корректную ссылку на изображение")]),
});

export async function updateMosqueSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session) return { error: "Сессия истекла, войдите заново" };

  const parsed = settingsSchema.safeParse({
    logoUrl: (formData.get("logoUrl") as string | null)?.trim() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поле" };
  }

  await prisma.mosque.update({
    where: { id: session.user.mosqueId },
    data: { logoUrl: parsed.data.logoUrl || null },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
