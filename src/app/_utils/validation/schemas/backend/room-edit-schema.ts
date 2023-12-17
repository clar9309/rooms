import { z } from "zod";
import { file_img_backend } from "../../validations/file-img-backend-validation";
import { stringValidation } from "../../validations/string-validation";
import { maxRoomTitleLen, minRoomTitleLen } from "../../validationVariables";

const editroomschema = z.object({
  title: stringValidation(minRoomTitleLen, maxRoomTitleLen, "Title"),
  roomId: z.string({
    required_error: `RoomId is required`,
    invalid_type_error: `RoomId must be a string`,
  }),
  cover_img: file_img_backend,
});
export default editroomschema;
