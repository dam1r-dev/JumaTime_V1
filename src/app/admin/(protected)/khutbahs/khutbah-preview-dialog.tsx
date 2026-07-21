"use client";

import { Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { localeNames, type Locale } from "@/i18n/routing";

export function KhutbahPreviewDialog({
  locale,
  date,
  title,
  summary,
  body,
}: {
  locale: Locale;
  date: string;
  title: string;
  summary: string;
  body: string;
}) {
  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Дата не указана";

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button type="button" variant="outline">
            <Smartphone className="size-4" />
            Предпросмотр
          </Button>
        }
      />
      <DialogContent className="w-full max-w-sm gap-0 overflow-hidden p-0 sm:max-w-sm">
        <DialogHeader className="border-b border-border bg-muted/50 px-4 py-3 pr-10">
          <DialogTitle className="text-sm">
            Как увидит прихожанин · {localeNames[locale]}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto bg-[var(--jt-cream)] px-5 py-6 text-[var(--jt-ink)]">
          <p className="text-sm text-[var(--jt-gold-600)]">{formattedDate}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {title.trim() || "Заголовок хутбы"}
          </h1>
          {summary.trim() && (
            <p className="mt-3 text-base text-muted-foreground">{summary}</p>
          )}
          <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-wrap text-base leading-relaxed">
            {body.trim() || "Текст хутбы появится здесь по мере заполнения."}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
