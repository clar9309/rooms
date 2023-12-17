import { z } from "zod";
import { first_name } from "../validations/firstname-validation";
import { last_name } from "../validations/lastname-validation";
import { email } from "../validations/email-validation";
import { password } from "../validations/password-validation";
import { birthday } from "../validations/birthday-validation";

//validation schema for creating a user
const createuserschema = z.object({
  //assembling our validations
  first_name: first_name,
  last_name: last_name,
  email: email,
  password: password,
  password_confirm: password,
  birthday: birthday,
}).superRefine(({ password_confirm, password }, ctx) => {
  if (password_confirm !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords must match",
      path: ['password_confirm']
    });
  }
});

export default createuserschema;
