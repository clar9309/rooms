import { z } from "zod";
import { stringValidation } from "../validations/string-validation";
import {
  maxParticipants,
  maxRoomTitleLen,
  minRoomTitleLen,
} from "../validationVariables";

const createroomschema = z.object({
  title: stringValidation(minRoomTitleLen, maxRoomTitleLen, "Title"),
  emails: z.array(z.string().email()).max(maxParticipants, {
    message: `Max number of users in a room is ${maxParticipants}`,
  }),
});
export default createroomschema;
