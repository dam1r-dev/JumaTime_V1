import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [khutbahCount, contentCounts] = await Promise.all([
    prisma.khutbah.count(),
    prisma.contentBlock.groupBy({ by: ["category"], _count: true }),
  ]);

  const countFor = (category: string) =>
    contentCounts.find((c) => c.category === category)?._count ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold">Обзор</h1>
      <p className="mt-1 text-muted-foreground">
        Управление хутбами и материалами платформы Jumma Time
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Хутбы</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{khutbahCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Сунны пятницы</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{countFor("SUNNAH")}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Рекомендуемые действия</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {countFor("RECOMMENDED_ACTION")}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Напоминания</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{countFor("REMINDER")}</CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          className="bg-[var(--jt-green-900)] hover:bg-[var(--jt-green-800)]"
          render={<Link href="/admin/khutbahs/new">Новая хутба</Link>}
        />
        <Button variant="outline" render={<Link href="/admin/content/new">Новый материал</Link>} />
      </div>
    </div>
  );
}
