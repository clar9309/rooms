import { z } from "zod";
import { minPasswordLen, maxPasswordLen } from "../validationVariables";

export const password = z
  .string({ required_error: "Password is required" })
  .min(minPasswordLen, {
    message: `Password must be at least ${minPasswordLen} characters long`,
  })
  .max(maxPasswordLen, {
    message: `Password can be a maximum of ${maxPasswordLen} characters long`,
  })
  .refine(
    (value) => {
      // At least one uppercase letter
      const hasUpperCase = /[A-Z]/.test(value);
      // At least one lowercase letter
      const hasLowerCase = /[a-z]/.test(value);
      // At least one digit
      const hasDigit = /\d/.test(value);

      return hasUpperCase && hasLowerCase && hasDigit;
    },
    {
      message:
        "Password must include one uppercase letter, one lowercase letter and one digit",
    }
  );
