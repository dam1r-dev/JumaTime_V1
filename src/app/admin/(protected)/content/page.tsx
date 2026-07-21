import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CATEGORY_LABELS } from "./categories";

export default async function AdminContentPage() {
  const session = await auth();
  const blocks = await prisma.contentBlock.findMany({
    where: { mosqueId: session!.user.mosqueId },
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: { translations: true },
  });

  const categories = Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Разделы сайта</h1>
        <Button
          className="bg-[var(--jt-green-900)] hover:bg-[var(--jt-green-800)]"
          render={
            <Link href="/admin/content/new">
              <Plus className="size-4" />
              Новый материал
            </Link>
          }
        />
      </div>

      <Tabs defaultValue={categories[0]} className="mt-6">
        <TabsList className="flex-wrap">
          {categories.map((c) => (
            <TabsTrigger key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((c) => {
          const items = blocks.filter((b) => b.category === c);
          return (
            <TabsContent key={c} value={c}>
              <div className="rounded-2xl border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">№</TableHead>
                      <TableHead>Заголовок</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.order}</TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/content/${item.id}`}
                            className="font-medium hover:underline"
                          >
                            {item.translations.find((t) => t.locale === "ru")?.title ??
                              item.translations[0]?.title ??
                              "—"}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.published ? "default" : "secondary"}>
                            {item.published ? "Опубликовано" : "Черновик"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                          Пока нет материалов
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
