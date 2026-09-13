-- Rename Khutbah -> Sermon and KhutbahTranslation -> SermonTranslation.
-- Written by hand (not via `prisma migrate dev`) because Prisma's diff engine
-- treats a model rename as DROP + CREATE, which would destroy existing rows.
-- SQLite's ALTER TABLE RENAME preserves data and updates FK references.

ALTER TABLE "Khutbah" RENAME TO "Sermon";
ALTER TABLE "KhutbahTranslation" RENAME TO "SermonTranslation";
ALTER TABLE "SermonTranslation" RENAME COLUMN "khutbahId" TO "sermonId";

DROP INDEX IF EXISTS "Khutbah_slug_key";
CREATE UNIQUE INDEX "Sermon_slug_key" ON "Sermon"("slug");

DROP INDEX IF EXISTS "Khutbah_mosqueId_date_idx";
CREATE INDEX "Sermon_mosqueId_date_idx" ON "Sermon"("mosqueId", "date");

DROP INDEX IF EXISTS "KhutbahTranslation_khutbahId_locale_key";
CREATE UNIQUE INDEX "SermonTranslation_sermonId_locale_key" ON "SermonTranslation"("sermonId", "locale");
