"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateMosqueSettings, type SettingsFormState } from "./actions";

export function SettingsForm({
  mosqueName,
  initialLogoUrl,
}: {
  mosqueName: string;
  initialLogoUrl: string;
}) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(
    updateMosqueSettings,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label>Мечеть</Label>
        <Input value={mosqueName} disabled />
        <p className="text-xs text-muted-foreground">
          Название мечети сейчас меняется напрямую в базе данных.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="logoUrl">Ссылка на логотип</Label>
        <Input
          key={initialLogoUrl}
          id="logoUrl"
          name="logoUrl"
          type="url"
          defaultValue={initialLogoUrl}
          placeholder="https://..."
        />
        <p className="text-xs text-muted-foreground">
          Ссылка на изображение логотипа мечети (загрузите его в любое хранилище — например,
          Google Диск с публичным доступом — и вставьте прямую ссылку сюда). Показывается на
          главной странице сайта. Оставьте пустым, чтобы использовать значок по умолчанию.
        </p>
      </div>

      {initialLogoUrl && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
          <Image
            src={initialLogoUrl}
            alt="Логотип мечети"
            width={48}
            height={48}
            unoptimized
            className="size-12 rounded-full object-cover ring-1 ring-border"
          />
          <p className="text-sm text-muted-foreground">Текущий логотип</p>
        </div>
      )}

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-[var(--jt-green-700)]">Сохранено.</p>
      )}

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
