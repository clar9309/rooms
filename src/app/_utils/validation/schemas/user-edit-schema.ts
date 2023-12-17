import { z } from "zod";
import { first_name } from "../validations/firstname-validation";
import { last_name } from "../validations/lastname-validation";
import { birthday } from "../validations/birthday-validation";
import { status } from "../validations/status-validation";
import { file_img } from "../validations/file-img-validation";

const edituserschema = z.object({
  first_name: first_name,
  last_name: last_name,
  birthday: birthday,
  status: status,
  avatar_img: file_img,
});

export default edituserschema;
