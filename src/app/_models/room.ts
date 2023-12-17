import { Cover, Location, Room } from "@prisma/client";
import { ExtendedParticipant } from "./participant";

export interface RoomCreateForm {
  title: string;
  emails: string[] | [];
}

export interface ExtendedRoom extends Room {
  cover?: Cover;
  participants?: ExtendedParticipant[];
  location?: Location;
}

export interface RoomEditForm {
  title: string;
  roomId: string;
  cover_img: string | Blob;
}
