import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminKhutbahsPage() {
  const session = await auth();
  const khutbahs = await prisma.khutbah.findMany({
    where: { mosqueId: session!.user.mosqueId },
    orderBy: { date: "desc" },
    include: { translations: { where: { locale: "kk" } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Хутбы</h1>
        <Button
          className="bg-[var(--jt-green-900)] hover:bg-[var(--jt-green-800)]"
          render={
            <Link href="/admin/khutbahs/new">
              <Plus className="size-4" />
              Новая хутба
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
            {khutbahs.map((k) => (
              <TableRow key={k.id}>
                <TableCell className="whitespace-nowrap">
                  {new Intl.DateTimeFormat("ru-RU").format(k.date)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/khutbahs/${k.id}`}
                    className="font-medium hover:underline"
                  >
                    {k.translations[0]?.title ?? k.slug}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={k.published ? "default" : "secondary"}>
                    {k.published ? "Опубликовано" : "Черновик"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {khutbahs.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  Пока нет хутб
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
