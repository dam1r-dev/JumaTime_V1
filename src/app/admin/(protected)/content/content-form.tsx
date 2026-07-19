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
import type { ContentFormState } from "./actions";
import { CATEGORY_LABELS } from "./categories";

type Translation = { locale: string; title: string; body: string };

export function ContentForm({
  action,
  initial,
}: {
  action: (state: ContentFormState, formData: FormData) => Promise<ContentFormState>;
  initial?: {
    category: string;
    order: number;
    published: boolean;
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
          <Label htmlFor="category">Раздел</Label>
          <Select name="category" defaultValue={initial?.category ?? "SUNNAH"}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order">Порядок</Label>
          <Input
            id="order"
            name="order"
            type="number"
            min={0}
            defaultValue={initial?.order ?? 0}
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={initial?.published ?? true}
            className="size-4 rounded border-input"
          />
          <Label htmlFor="published">Опубликовано</Label>
        </div>
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
                <Label htmlFor={`body_${l}`}>Текст</Label>
                <Textarea
                  id={`body_${l}`}
                  name={`body_${l}`}
                  defaultValue={t?.body}
                  rows={8}
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
