import { z } from "zod";
import { title } from "../validations/note-title-validation";
import { text } from "../validations/note-text-validation";

//validation schema for creating a note
const createnoteschema = z.object({
  //assembling our validations
  title: title,
  text: text,
  title_format: z.string(),
  text_format: z.string(),
  title_alignment: z.string(),
  text_alignment: z.string(),
  note_widget_fk: z.string(),
});

export default createnoteschema;
