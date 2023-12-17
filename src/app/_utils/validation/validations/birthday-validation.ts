import { z } from "zod";
import { dateFormat, minAge } from "../validationVariables";

const isValidDate = (dateString: string) => dateFormat.test(dateString);

const isOver13YearsOld = (dateString: string) => {
  const birthDate = new Date(dateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  // Check if the birthday has occurred this year
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--; // Subtract 1 from the age if the birthday hasn't occurred yet
  }

  if (age >= minAge) {
    return true;
  }
  return false;
};

export const birthday = z
  .string({ required_error: "Birthday is required" })
  .refine((value) => isValidDate(value), {
    message: "Invalid date format. Please use YYYY-MM-DD.",
  })
  .refine((value) => isOver13YearsOld(value), {
    message: "You must be at least 13 years old.",
  });
