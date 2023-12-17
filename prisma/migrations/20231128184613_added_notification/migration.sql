/*
  Warnings:

  - You are about to drop the `TaskItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskItems" DROP CONSTRAINT "TaskItems_task_widget_fk_fkey";

-- DropTable
DROP TABLE "TaskItems";

-- CreateTable
CREATE TABLE "TaskItem" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "task_widget_fk" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL,
    "checked" BOOLEAN NOT NULL,

    CONSTRAINT "TaskItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,
    "meta_user_id" TEXT NOT NULL,
    "meta_action" TEXT NOT NULL,
    "meta_target" TEXT NOT NULL,
    "meta_target_name" TEXT NOT NULL,
    "meta_link" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskItem" ADD CONSTRAINT "TaskItem_task_widget_fk_fkey" FOREIGN KEY ("task_widget_fk") REFERENCES "TaskWidget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_meta_user_id_fkey" FOREIGN KEY ("meta_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
