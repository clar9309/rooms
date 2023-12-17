import { z } from "zod";
import { minTextNoteLen, maxTextNoteLen } from "../validationVariables";

export const text = z
  .string({
    required_error: "Text is required",
    invalid_type_error: "Text must be a string",
  })
  .transform((value) => value.trim())
  .refine(
    (value) => {
      return value.length >= minTextNoteLen && value.length <= maxTextNoteLen;
    },
    {
      message: `Text must be between ${minTextNoteLen} and ${maxTextNoteLen}`,
    }
  );
