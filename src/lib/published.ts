export type PublishStatus = "draft" | "scheduled" | "published";
export type PublishFormStatus = "draft" | "now" | "schedule";

export const PUBLISH_STATUS_LABELS: Record<PublishStatus, string> = {
  draft: "Черновик",
  scheduled: "Запланировано",
  published: "Опубликовано",
};

export function getPublishStatus(publishedAt: Date | null): PublishStatus {
  if (!publishedAt) return "draft";
  return publishedAt.getTime() <= Date.now() ? "published" : "scheduled";
}

/**
 * Prisma where-clause fragment for "visible to the public right now".
 * `lte` naturally excludes NULL rows (drafts) at the SQL level, so this
 * also correctly excludes anything scheduled for later.
 */
export function publishedWhere() {
  return { publishedAt: { lte: new Date() } };
}

/** Resolves the "Черновик / Сейчас / По расписанию" admin form choice into a publishedAt value. */
export function resolvePublishedAtFromForm(
  status: FormDataEntryValue | null,
  scheduledFor: FormDataEntryValue | null
): { publishedAt: Date | null } | { error: string } {
  if (status === "draft") return { publishedAt: null };
  if (status === "now") return { publishedAt: new Date() };
  if (status === "schedule") {
    if (typeof scheduledFor !== "string" || !scheduledFor) {
      return { error: "Укажите дату и время публикации" };
    }
    const date = new Date(scheduledFor);
    if (Number.isNaN(date.getTime())) {
      return { error: "Некорректная дата публикации" };
    }
    return { publishedAt: date };
  }
  return { error: "Некорректный статус публикации" };
}

/** The inverse of resolvePublishedAtFromForm — builds the admin form's initial state from a stored value. */
export function toFormPublishState(
  publishedAt: Date | null
): { status: PublishFormStatus; scheduledFor: string } {
  if (!publishedAt) return { status: "draft", scheduledFor: "" };
  if (publishedAt.getTime() <= Date.now()) return { status: "now", scheduledFor: "" };

  const pad = (n: number) => String(n).padStart(2, "0");
  const scheduledFor =
    `${publishedAt.getFullYear()}-${pad(publishedAt.getMonth() + 1)}-${pad(publishedAt.getDate())}` +
    `T${pad(publishedAt.getHours())}:${pad(publishedAt.getMinutes())}`;
  return { status: "schedule", scheduledFor };
}
