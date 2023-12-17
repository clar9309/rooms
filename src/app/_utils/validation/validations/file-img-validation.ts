import { z } from "zod";
import { acceptedImageTypes, maxFileSize } from "../validationVariables";
import filetypeinfo from "magic-bytes.js";

export const file_img = z
  .any()
  .optional()
  .nullable()
  .refine(
    (file) => {
      if (!file) return true;
      return file.size <= maxFileSize;
    },
    {
      message: "Max image size is 5MB",
    }
  )
  .refine(
    (file) => {
      if (!file) return true;
      return acceptedImageTypes.includes(file.type.toLowerCase());
    },
    {
      message: "Only .jpg, .jpeg, .png formats are supported",
    }
  )
  .refine(async (file) => {
    if (!file) return true;
    const isValid = await validateMIMEType(file);
    return isValid;
  }, "Invalid file type");

const validateMIMEType = async (file: File): Promise<boolean> => {
  if (!file) return true;
  const mime = await getMIMEType(file);
  const isValid = mime
    ? acceptedImageTypes.includes(mime.toLowerCase())
    : false;
  return isValid;
};
const getMIMEType = async (file: File): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onloadend = async (f) => {
      const bytes = new Uint8Array(f.target!.result as ArrayBuffer);
      const mimes = await filetypeinfo(bytes);
      const mime = mimes[0]?.mime;
      resolve(mime);
    };
    fileReader.readAsArrayBuffer(file);
  });
};
