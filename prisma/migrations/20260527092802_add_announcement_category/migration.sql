-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'umum';

-- CreateIndex
CREATE INDEX "Announcement_category_idx" ON "Announcement"("category");
