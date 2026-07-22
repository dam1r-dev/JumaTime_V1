"use client";

import { useActionState, useState } from "react";
import { Loader2, Wand2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { localeNames, locales, type Locale } from "@/i18n/routing";
import { buildSlug } from "@/lib/slugify";
import type { KhutbahFormState } from "./actions";
import { KhutbahPreviewDialog } from "./khutbah-preview-dialog";

type Translation = { locale: string; title: string; summary: string; body: string };

export function KhutbahForm({
  action,
  initial,
}: {
  action: (state: KhutbahFormState, formData: FormData) => Promise<KhutbahFormState>;
  initial?: {
    slug: string;
    date: string;
    published: boolean;
    originalLocale: string;
    translations: Translation[];
  };
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  const translationFor = (locale: string) =>
    initial?.translations.find((t) => t.locale === locale);

  const [date, setDate] = useState(initial?.date ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [activeLocale, setActiveLocale] = useState<Locale>("kk");
  const [fields, setFields] = useState<
    Record<Locale, { title: string; summary: string; body: string }>
  >(() => {
    const entry = {} as Record<Locale, { title: string; summary: string; body: string }>;
    for (const l of locales) {
      const t = translationFor(l);
      entry[l] = { title: t?.title ?? "", summary: t?.summary ?? "", body: t?.body ?? "" };
    }
    return entry;
  });

  const isFilled = (l: Locale) => fields[l].title.trim() !== "" && fields[l].body.trim() !== "";
  const filledCount = locales.filter(isFilled).length;

  function updateField(l: Locale, key: "title" | "summary" | "body", value: string) {
    setFields((prev) => ({ ...prev, [l]: { ...prev[l], [key]: value } }));
  }

  function generateSlug() {
    const firstTitle = locales.map((l) => fields[l].title).find((t) => t.trim() !== "") ?? "";
    setSlug(buildSlug(firstTitle, date));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="slug">URL (slug)</Label>
          <div className="flex gap-2">
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tema-hutby-2026-07-18"
              required
              className="font-mono"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Сформировать из даты и заголовка"
              title="Сформировать из даты и заголовка"
              onClick={generateSlug}
            >
              <Wand2 className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Часть адреса страницы — только латиница, цифры и дефис. Кнопка со звёздочкой
            сформирует его сама из даты и первого заполненного заголовка.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Дата</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:max-w-xs">
        <Label htmlFor="originalLocale">Язык оригинала</Label>
        <Select name="originalLocale" defaultValue={initial?.originalLocale ?? "kk"}>
          <SelectTrigger id="originalLocale">
            <SelectValue>
              {(value: Locale) => localeNames[value]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {locales.map((l) => (
              <SelectItem key={l} value={l}>
                {localeNames[l]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          На этом языке хутба показывается там, где перевод ещё не готов.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={initial?.published ?? true}
          className="size-4 rounded border-input"
        />
        <Label htmlFor="published">Опубликовано</Label>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          Достаточно заполнить <strong>один язык</strong> (заголовок + текст) — на остальных
          сайт покажет этот же текст с пометкой «перевод пока не готов», пока вы не добавите
          перевод. Языки с галочкой уже готовы: заполнено {filledCount} из {locales.length}.
        </p>
        <Tabs
          value={activeLocale}
          onValueChange={(value) => setActiveLocale(value as Locale)}
        >
          <TabsList>
            {locales.map((l) => (
              <TabsTrigger key={l} value={l} className="gap-1.5">
                {isFilled(l) && <Check className="size-3.5 text-[var(--jt-green-700)]" />}
                {localeNames[l]}
              </TabsTrigger>
            ))}
          </TabsList>
          {locales.map((l) => (
            <TabsContent key={l} value={l} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`title_${l}`}>Заголовок</Label>
                <Input
                  id={`title_${l}`}
                  name={`title_${l}`}
                  value={fields[l].title}
                  onChange={(e) => updateField(l, "title", e.target.value)}
                  placeholder="Например: Шүкіршілік — сенімнің жартысы"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`summary_${l}`}>Краткое описание</Label>
                <Textarea
                  id={`summary_${l}`}
                  name={`summary_${l}`}
                  value={fields[l].summary}
                  onChange={(e) => updateField(l, "summary", e.target.value)}
                  placeholder="1-2 предложения — показывается в списке хутб"
                  rows={2}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`body_${l}`}>Текст хутбы</Label>
                <Textarea
                  id={`body_${l}`}
                  name={`body_${l}`}
                  value={fields[l].body}
                  onChange={(e) => updateField(l, "body", e.target.value)}
                  placeholder="Полный текст хутбы на этом языке"
                  rows={14}
                />
              </div>
              <div>
                <KhutbahPreviewDialog
                  locale={l}
                  date={date}
                  title={fields[l].title}
                  summary={fields[l].summary}
                  body={fields[l].body}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[var(--jt-green-900)] hover:bg-[var(--jt-green-800)]"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Сохранить
        </Button>
      </div>
    </form>
  );
}
