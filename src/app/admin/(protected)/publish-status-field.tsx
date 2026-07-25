"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PublishFormStatus } from "@/lib/published";

const STATUS_LABELS: Record<PublishFormStatus, string> = {
  draft: "Черновик",
  now: "Опубликовано",
  schedule: "Запланировано",
};

const STATUS_HINTS: Record<PublishFormStatus, string> = {
  draft: "Черновик не виден на сайте.",
  now: "Будет видно на сайте сразу после сохранения.",
  schedule:
    "Текст сам появится на сайте в указанное время — не нужно быть за компьютером в момент публикации.",
};

export function PublishStatusField({
  initialStatus,
  initialScheduledFor,
}: {
  initialStatus: PublishFormStatus;
  initialScheduledFor: string;
}) {
  const [status, setStatus] = useState<PublishFormStatus>(initialStatus);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="publishStatus">Публикация</Label>
      <Select
        name="publishStatus"
        value={status}
        onValueChange={(value) => setStatus(value as PublishFormStatus)}
      >
        <SelectTrigger id="publishStatus">
          <SelectValue>
            {(value: PublishFormStatus) => STATUS_LABELS[value]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {status === "schedule" && (
        <Input
          type="datetime-local"
          name="scheduledFor"
          defaultValue={initialScheduledFor}
          required
          className="mt-1"
        />
      )}
      <p className="text-xs text-muted-foreground">{STATUS_HINTS[status]}</p>
    </div>
  );
}
