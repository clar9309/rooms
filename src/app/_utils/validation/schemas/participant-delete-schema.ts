import { z } from "zod";

const participantdeleteschema = z.object({
  roomId: z.string({
    required_error: `RoomId is required`,
    invalid_type_error: `RoomId must be a string`,
  }),
  userId: z.string({
    required_error: `RoomId is required`,
    invalid_type_error: `RoomId must be a string`,
  }),
});

export default participantdeleteschema;
