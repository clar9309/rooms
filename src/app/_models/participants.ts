import { Participant, User } from "@prisma/client";

export interface ExtendedParticipant extends Participant {
  user?: User;
}

export interface ParticipantCreateForm {
  emails: string[] | [];
  roomId: string;
}
