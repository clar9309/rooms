import { Participant } from "@prisma/client";
import { ExtendedUser } from "./user";

export interface ExtendedParticipant extends Participant {
  user?: ExtendedUser;
}

export interface ParticipantCreateForm {
  emails: string[] | [];
  roomId: string;
}

export interface ParticipantDeleteForm {
  userId: string;
  roomId: string;
}
