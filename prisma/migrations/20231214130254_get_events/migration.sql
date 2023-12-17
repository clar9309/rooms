/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventAttendee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_admin_fk_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_room_id_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_event_id_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_location_id_fkey";

-- DropIndex
DROP INDEX "Location_latitude_longitude_key";

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("latitude", "longitude");

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "location_id" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventAttendee";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
