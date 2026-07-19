"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
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
import { localeNames, locales } from "@/i18n/routing";
import type { KhutbahFormState } from "./actions";

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

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">URL (slug)</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={initial?.slug}
            placeholder="juma-2026-07-18"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Дата</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={initial?.date}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="originalLocale">Язык оригинала</Label>
          <Select name="originalLocale" defaultValue={initial?.originalLocale ?? "kk"}>
            <SelectTrigger id="originalLocale">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locales.map((l) => (
                <SelectItem key={l} value={l}>
                  {localeNames[l]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

      <Tabs defaultValue="kk">
        <TabsList>
          {locales.map((l) => (
            <TabsTrigger key={l} value={l}>
              {localeNames[l]}
            </TabsTrigger>
          ))}
        </TabsList>
        {locales.map((l) => {
          const t = translationFor(l);
          return (
            <TabsContent key={l} value={l} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`title_${l}`}>Заголовок</Label>
                <Input id={`title_${l}`} name={`title_${l}`} defaultValue={t?.title} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`summary_${l}`}>Краткое описание</Label>
                <Textarea
                  id={`summary_${l}`}
                  name={`summary_${l}`}
                  defaultValue={t?.summary}
                  rows={2}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`body_${l}`}>Текст хутбы</Label>
                <Textarea
                  id={`body_${l}`}
                  name={`body_${l}`}
                  defaultValue={t?.body}
                  rows={14}
                />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

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
