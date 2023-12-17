import { z } from "zod";

export const taskCreatedByValidation = z.string({
  required_error: "Text is required",
  invalid_type_error: "Text must be a string",
});
