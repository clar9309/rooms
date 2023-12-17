import { z } from "zod";
import { email } from "../validations/email-validation";
import { password } from "../validations/password-validation";

//validation schema for login
const userloginschema = z.object({
  email: email,
  password: password,

});

export default userloginschema;
