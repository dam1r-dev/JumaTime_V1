import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PublishStatusBadge } from "../publish-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminSermonsPage() {
  const session = await auth();
  const sermons = await prisma.sermon.findMany({
    where: { mosqueId: session!.user.mosqueId },
    orderBy: { date: "desc" },
    include: { translations: { where: { locale: "kk" } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Проповеди</h1>
        <Button
          className="bg-[var(--jt-green-900)] hover:bg-[var(--jt-green-800)]"
          render={
            <Link href="/admin/sermons/new">
              <Plus className="size-4" />
              Новая проповедь
            </Link>
          }
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sermons.map((k) => (
              <TableRow key={k.id}>
                <TableCell className="whitespace-nowrap">
                  {new Intl.DateTimeFormat("ru-RU").format(k.date)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/sermons/${k.id}`}
                    className="font-medium hover:underline"
                  >
                    {k.translations[0]?.title ?? k.slug}
                  </Link>
                </TableCell>
                <TableCell>
                  <PublishStatusBadge publishedAt={k.publishedAt} />
                </TableCell>
              </TableRow>
            ))}
            {sermons.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  Пока нет проповедей
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
