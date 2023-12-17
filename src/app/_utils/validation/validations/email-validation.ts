import { z } from "zod";

export const email = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email({ message: "Not a valid email address" });
