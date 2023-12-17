import { z } from "zod";

export const time = (name: string) => {
  return z
    .string({
      required_error: `${name} is required`,
      invalid_type_error: `${name} Time must be a string`,
    })
    .refine((val) => /\d{2}:\d{2}/.test(val));
};
