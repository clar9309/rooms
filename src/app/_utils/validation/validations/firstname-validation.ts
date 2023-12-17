import { z } from "zod";
import { minFirstNameLen, maxFirstNameLen } from "../validationVariables";

export const first_name = z
  .string({
    required_error: "First name is required",
    invalid_type_error: "First name must be a string",
  })
  .transform((value) => value.trim()) // Trims trailing spaces
  .refine(
    //Custom val as .min .max methods are not available on zod transform/effects
    (value) =>
      value.length >= minFirstNameLen && value.length <= maxFirstNameLen,
    {
      message: `First name must be between ${minFirstNameLen} and ${maxFirstNameLen}`,
    }
  );
