/*
  Warnings:

  - You are about to drop the column `published` on the `ContentBlock` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Khutbah` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mosqueId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentBlock_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ContentBlock" ("category", "createdAt", "id", "mosqueId", "order", "updatedAt") SELECT "category", "createdAt", "id", "mosqueId", "order", "updatedAt" FROM "ContentBlock";
DROP TABLE "ContentBlock";
ALTER TABLE "new_ContentBlock" RENAME TO "ContentBlock";
CREATE INDEX "ContentBlock_mosqueId_category_order_idx" ON "ContentBlock"("mosqueId", "category", "order");
CREATE TABLE "new_Khutbah" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mosqueId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    "originalLocale" TEXT NOT NULL DEFAULT 'kk',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Khutbah_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Khutbah" ("createdAt", "date", "id", "mosqueId", "originalLocale", "slug", "updatedAt") SELECT "createdAt", "date", "id", "mosqueId", "originalLocale", "slug", "updatedAt" FROM "Khutbah";
DROP TABLE "Khutbah";
ALTER TABLE "new_Khutbah" RENAME TO "Khutbah";
CREATE UNIQUE INDEX "Khutbah_slug_key" ON "Khutbah"("slug");
CREATE INDEX "Khutbah_mosqueId_date_idx" ON "Khutbah"("mosqueId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
