/*
  Warnings:

  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `location_id` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[latitude,longitude]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `Location` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `created_by_fk` to the `TaskItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_location_id_fkey";

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "location_id",
ADD COLUMN     "location_id" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TaskItem" ADD COLUMN     "created_by_fk" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Location_id_key" ON "Location"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_latitude_longitude_key" ON "Location"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskItem" ADD CONSTRAINT "TaskItem_created_by_fk_fkey" FOREIGN KEY ("created_by_fk") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
