import { z } from "zod";
import { taskTextValidation } from "../../validations/task-text-validation";

const taskcreateschema = z.object({
  text: taskTextValidation,
  task_widget_fk: z.string(),
  created_by_fk: z.string(),
  roomId: z.string(),
});

export default taskcreateschema;
