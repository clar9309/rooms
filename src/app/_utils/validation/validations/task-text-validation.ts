import { z } from "zod";
import { maxText, minText } from "../validationVariables";

export const taskTextValidation = z
  .string({
    required_error: "Text is required",
    invalid_type_error: "Text must be a string",
  })
  .max(maxText, {
    message: `task can not be longer than ${maxText} characthers`,
  })
  .min(minText, {
    message: `task must be minimum ${minText} characthers long`,
  });
