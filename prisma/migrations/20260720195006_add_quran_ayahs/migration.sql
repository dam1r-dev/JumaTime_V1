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

-- CreateIndex
CREATE UNIQUE INDEX "QuranAyah_surahNumber_ayahNumber_key" ON "QuranAyah"("surahNumber", "ayahNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QuranAyahTranslation_ayahId_locale_key" ON "QuranAyahTranslation"("ayahId", "locale");
