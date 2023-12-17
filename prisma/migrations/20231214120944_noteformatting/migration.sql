-- AlterTable
ALTER TABLE "NoteItem" ADD COLUMN     "text_format_fk" TEXT,
ADD COLUMN     "title_format_fk" TEXT;

-- CreateTable
CREATE TABLE "NoteFormat" (
    "id" TEXT NOT NULL,
    "formatting" TEXT NOT NULL,

    CONSTRAINT "NoteFormat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NoteItem" ADD CONSTRAINT "NoteItem_text_format_fk_fkey" FOREIGN KEY ("text_format_fk") REFERENCES "NoteFormat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteItem" ADD CONSTRAINT "NoteItem_title_format_fk_fkey" FOREIGN KEY ("title_format_fk") REFERENCES "NoteFormat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
