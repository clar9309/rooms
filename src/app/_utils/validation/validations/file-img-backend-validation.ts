import { z } from "zod";
import { acceptedImageTypes, maxFileSize } from "../validationVariables";

export const file_img_backend = z
  .any()
  .optional()
  .nullable()
  .refine((file) => {
    if (!file || file) return true;
    return file.size <= maxFileSize;
  }, "Max image size is 5MB")
  .refine(
    (file) => {
      if (!file) return true;
      return acceptedImageTypes.includes(file.type.toLowerCase());
    },
    {
      message: "Only .jpg, .jpeg, .png formats are supported",
    }
  );
