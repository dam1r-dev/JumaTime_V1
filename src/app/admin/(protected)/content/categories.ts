export const CATEGORIES = [
  "SUNNAH",
  "RECOMMENDED_ACTION",
  "REMINDER",
  "FRIDAY_VIRTUE",
  "AL_KAHF",
] as const;

export const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  SUNNAH: "Сунны пятницы",
  RECOMMENDED_ACTION: "Рекомендуемые действия",
  REMINDER: "Напоминания",
  FRIDAY_VIRTUE: "Достоинства пятницы",
  AL_KAHF: "Сура Аль-Кахф",
};
