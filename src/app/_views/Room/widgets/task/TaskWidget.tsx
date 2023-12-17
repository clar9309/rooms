"use client";
import TaskListItem from "@/app/_views/Tasks/TaskListItem";
import { Room, TaskItem } from "@prisma/client";

interface TaskWidgetProps {
  tasks?: TaskItem[];
  room: Room;
  taskWidgetId: string;
  modalParams: { modal: string } | undefined | null;
}

function TaskWidget(props: TaskWidgetProps) {
  return (
    <>
      {props.tasks && props.tasks.length > 0 ? (
        <div className="w-full h-full flex flex-col">
          <h3 className="text-h3 font-medium mb-5">Tasks</h3>
          <ul className="flex h-full max-h-[200px] overflow-y-auto flex-col gap-3">
            {props.tasks.map((taskitem) => (
              <TaskListItem
                key={taskitem.id}
                text={taskitem.text}
                checked={taskitem.checked}
              />
            ))}
          </ul>
          <p className="text-xs text-right text-darkGrey ml-auto">All tasks</p>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="h-full flex flex-col justify-center">
            <p className="text-h3 mb-2">No tasks yet</p>
            <p className="text-base text-darkGrey mb-2">
              There are not any tasks yet
            </p>
          </div>
          <svg
            className="ml-auto mt-auto"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M11.99 21C10.7487 21 9.582 20.7633 8.49 20.29C7.398 19.8167 6.44667 19.175 5.636 18.365C4.82467 17.555 4.18267 16.6033 3.71 15.51C3.23667 14.416 3 13.247 3 12.003C3 10.759 3.23633 9.589 3.709 8.493C4.18167 7.39767 4.823 6.44467 5.633 5.634C6.443 4.82333 7.39533 4.18167 8.49 3.709C9.58533 3.23633 10.7553 3 12 3C13.0233 3 13.9917 3.15833 14.905 3.475C15.8183 3.79167 16.6513 4.23333 17.404 4.8L16.684 5.544C16.0253 5.05467 15.3007 4.67467 14.51 4.404C13.7193 4.13467 12.8827 4 12 4C9.78333 4 7.89567 4.77933 6.337 6.338C4.77833 7.89667 3.99933 9.784 4 12C4 14.2167 4.77933 16.1043 6.338 17.663C7.89667 19.2217 9.784 20.0007 12 20C12.5847 20 13.1527 19.9373 13.704 19.812C14.2553 19.686 14.7833 19.512 15.288 19.29L16.038 20.046C15.4313 20.354 14.7887 20.59 14.11 20.754C13.43 20.918 12.7233 21 11.99 21ZM19.5 19.5V16.5H16.5V15.5H19.5V12.5H20.5V15.5H23.5V16.5H20.5V19.5H19.5ZM10.562 15.908L7.004 12.35L7.712 11.642L10.562 14.492L20.292 4.756L21 5.463L10.562 15.908Z"
              fill="#EAEAEB"
            />
          </svg>
        </div>
      )}
    </>
  );
}

export default TaskWidget;
