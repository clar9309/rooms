import { z } from "zod";
import { minTitleNoteLen, maxTitleNoteLen } from "../validationVariables";

export const title = z
  .string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  })
  .transform((value) => value.trim())
  .refine(
    (value) => {
      return value.length >= minTitleNoteLen && value.length <= maxTitleNoteLen;
    },
    {
      message: `Title must be between ${minTitleNoteLen} and ${maxTitleNoteLen}`,
    }
  );
