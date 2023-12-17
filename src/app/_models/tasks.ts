import { TaskItem, TaskWidget } from "@prisma/client";

export interface CreateTaskForm {
  text: string;
  task_widget_fk: string;
  roomId: string;
}

export interface ExpandedTaskWidget extends TaskWidget {
  task_item: TaskItem[];
}
