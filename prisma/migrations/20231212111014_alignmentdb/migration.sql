-- AlterTable
ALTER TABLE "NoteItem" ADD COLUMN     "text_alignment_fk" TEXT,
ADD COLUMN     "title_alignment_fk" TEXT;

-- CreateTable
CREATE TABLE "NoteAlignment" (
    "id" TEXT NOT NULL,
    "alignment" TEXT NOT NULL,

    CONSTRAINT "NoteAlignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NoteItem" ADD CONSTRAINT "NoteItem_title_alignment_fk_fkey" FOREIGN KEY ("title_alignment_fk") REFERENCES "NoteAlignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteItem" ADD CONSTRAINT "NoteItem_text_alignment_fk_fkey" FOREIGN KEY ("text_alignment_fk") REFERENCES "NoteAlignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
