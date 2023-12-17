import { z } from "zod";

export const status = z
  .string({
    required_error: "Status is required",
    invalid_type_error: "Status must be a string",
  })
  .transform((value) => value.trim());
