-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin_fk" TEXT NOT NULL,
    "location_id" TEXT,
    "cover_id" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cover" (
    "id" TEXT NOT NULL,
    "formatted_url" TEXT NOT NULL,
    "cloudinary_public_id" TEXT NOT NULL,

    CONSTRAINT "Cover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "state" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("latitude","longitude")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "is_favourited" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "avatar_id" TEXT,
    "status_fk" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "formatted_url" TEXT NOT NULL,
    "cloudinary_public_id" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteWidget" (
    "id" TEXT NOT NULL,
    "room_fk" TEXT NOT NULL,

    CONSTRAINT "NoteWidget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note_widget_fk" TEXT NOT NULL,

    CONSTRAINT "NoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskWidget" (
    "id" TEXT NOT NULL,
    "room_fk" TEXT NOT NULL,

    CONSTRAINT "TaskWidget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskItems" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "task_widget_fk" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL,
    "checked" BOOLEAN NOT NULL,

    CONSTRAINT "TaskItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_cover_id_key" ON "Room"("cover_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_id_key" ON "Location"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_user_id_room_id_key" ON "Participant"("user_id", "room_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_avatar_id_key" ON "users"("avatar_id");

-- CreateIndex
CREATE UNIQUE INDEX "Status_title_key" ON "Status"("title");

-- CreateIndex
CREATE UNIQUE INDEX "NoteWidget_room_fk_key" ON "NoteWidget"("room_fk");

-- CreateIndex
CREATE UNIQUE INDEX "NoteWidget_id_room_fk_key" ON "NoteWidget"("id", "room_fk");

-- CreateIndex
CREATE UNIQUE INDEX "TaskWidget_room_fk_key" ON "TaskWidget"("room_fk");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_admin_fk_fkey" FOREIGN KEY ("admin_fk") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_cover_id_fkey" FOREIGN KEY ("cover_id") REFERENCES "Cover"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_status_fk_fkey" FOREIGN KEY ("status_fk") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteWidget" ADD CONSTRAINT "NoteWidget_room_fk_fkey" FOREIGN KEY ("room_fk") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteItem" ADD CONSTRAINT "NoteItem_note_widget_fk_fkey" FOREIGN KEY ("note_widget_fk") REFERENCES "NoteWidget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskWidget" ADD CONSTRAINT "TaskWidget_room_fk_fkey" FOREIGN KEY ("room_fk") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskItems" ADD CONSTRAINT "TaskItems_task_widget_fk_fkey" FOREIGN KEY ("task_widget_fk") REFERENCES "TaskWidget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
