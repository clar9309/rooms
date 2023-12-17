import { z } from "zod";

export const stringValidation = (
  minLength: number,
  maxLength: number,
  fieldName: string
) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a string`,
    })
    .transform((value) => value.trim())
    .refine((value) => value.length >= minLength && value.length <= maxLength, {
      message: `${fieldName} must be between ${minLength} and ${maxLength}`,
    });
