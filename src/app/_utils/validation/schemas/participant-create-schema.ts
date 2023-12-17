import { z } from "zod";
import { maxParticipants } from "../validationVariables";
import { ExtendedParticipant } from "@/app/_models/participant";

const participantcreateschema = z.object({
  roomId: z.string({
    required_error: `RoomId is required`,
    invalid_type_error: `RoomId must be a string`,
  }),
  emails: z.array(z.string().email()).max(maxParticipants, {
    message: `Max number of users in a room is ${maxParticipants}`,
  }),
});

const calculateMaxAdditionalParticipants = (
  currentParticipants: ExtendedParticipant[]
) => {
  const currentCount = currentParticipants.length;
  return Math.max(0, maxParticipants - currentCount);
};

export { participantcreateschema, calculateMaxAdditionalParticipants };
