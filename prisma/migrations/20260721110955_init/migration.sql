-- CreateTable
CREATE TABLE "Mosque" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mosqueId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminUser_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Khutbah" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mosqueId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "originalLocale" TEXT NOT NULL DEFAULT 'kk',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Khutbah_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KhutbahTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "khutbahId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    CONSTRAINT "KhutbahTranslation_khutbahId_fkey" FOREIGN KEY ("khutbahId") REFERENCES "Khutbah" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuranAyah" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surahNumber" INTEGER NOT NULL,
    "ayahNumber" INTEGER NOT NULL,
    "textArabic" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "QuranAyahTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ayahId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "QuranAyahTranslation_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "QuranAyah" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mosqueId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentBlock_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentBlockId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    CONSTRAINT "ContentTranslation_contentBlockId_fkey" FOREIGN KEY ("contentBlockId") REFERENCES "ContentBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Mosque_slug_key" ON "Mosque"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Khutbah_slug_key" ON "Khutbah"("slug");

-- CreateIndex
CREATE INDEX "Khutbah_mosqueId_date_idx" ON "Khutbah"("mosqueId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "KhutbahTranslation_khutbahId_locale_key" ON "KhutbahTranslation"("khutbahId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "QuranAyah_surahNumber_ayahNumber_key" ON "QuranAyah"("surahNumber", "ayahNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QuranAyahTranslation_ayahId_locale_key" ON "QuranAyahTranslation"("ayahId", "locale");

-- CreateIndex
CREATE INDEX "ContentBlock_mosqueId_category_order_idx" ON "ContentBlock"("mosqueId", "category", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ContentTranslation_contentBlockId_locale_key" ON "ContentTranslation"("contentBlockId", "locale");
