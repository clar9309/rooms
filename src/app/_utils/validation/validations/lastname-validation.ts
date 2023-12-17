import { z } from "zod";
import { minLastNameLen, maxLastNameLen } from "../validationVariables";

export const last_name = z
  .string({
    required_error: "Last name is required",
    invalid_type_error: "Last name must be a string",
  })
  .transform((value) => value.trim())
  .refine(
    (value) => value.length >= minLastNameLen && value.length <= maxLastNameLen,
    {
      message: `Last name must be between ${minLastNameLen} and ${maxLastNameLen}`,
    }
  );
