import { z } from "zod";

const locationschema = z.object({
  id: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string({
    required_error: `Country is required`,
    invalid_type_error: `Country must be a string`,
  }),
  city: z.string({
    required_error: `City is required`,
    invalid_type_error: `City must be a string`,
  }),
  state: z.string().optional(),
  roomId: z.string({
    required_error: `RoomId is required`,
    invalid_type_error: `RoomId must be a string`,
  }),
});

export default locationschema;
