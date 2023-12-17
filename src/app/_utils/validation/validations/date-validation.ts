import { z } from "zod";

export const date = (name: string) => {
  return z
    .string({
      required_error: `${name} is required`,
      invalid_type_error: `${name} must be a string`,
    })
    .refine((val) => /\d{2}-\d{2}-\d{2}/.test(val));
};
