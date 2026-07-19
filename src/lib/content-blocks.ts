import { prisma } from "./prisma";
import { pickTranslation } from "./i18n-content";
import type { Locale } from "@/i18n/routing";
import type { ContentCategory } from "@/generated/prisma/client";

export async function getContentBlocks(category: ContentCategory, locale: Locale) {
  const blocks = await prisma.contentBlock.findMany({
    where: { category, published: true },
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  return blocks
    .map((block) => ({ block, content: pickTranslation(block.translations, locale) }))
    .filter(
      (x): x is { block: typeof x.block; content: NonNullable<typeof x.content> } =>
        x.content !== null
    );
}
