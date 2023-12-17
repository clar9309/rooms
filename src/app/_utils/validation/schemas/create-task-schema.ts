import { z } from "zod";
import { taskTextValidation } from "../validations/task-text-validation";

const createtextschema = z.object({
  text: taskTextValidation,
  task_widget_fk: z.string(),
  // created_by_fk: z.string(),
});

export default createtextschema;
