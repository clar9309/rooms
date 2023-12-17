"use client";
import Link from "next/link";
import TaskForm from "@/app/_components/forms/TaskForm";
import { Room, TaskItem } from "@prisma/client";
import TaskItemForm from "@/app/_components/forms/TaskItemForm";
import { useState } from "react";

interface TaskWidgetProps {
  taskList?: TaskItem[];
  room: Room;
  taskWidgetId: string;
  setTaskList: (taskList: TaskItem[]) => void;
}

export default function TaskModal({
  taskList,
  room,
  taskWidgetId,
  setTaskList,
}: TaskWidgetProps) {
  const [showOnlyChecked, setShowOnlyChecked] = useState(false);

  return (
    <>
      <div className="w-full mt-3 sm:mt-0 sm:text-left gap-3">
        <div className="flex justify-between items-start">
          <h2
            className="text-h2 leading-6 my-4 md:my-10 font-normal"
            id="modal-title"
          >
            Tasks
          </h2>
          <div className="absolute top-0 right-0 mr-4">
            <Link
              href={`/rooms/${room.id}/`}
              type="button"
              className="w-full grid transition hover:bg-white hover:bg-opacity-5 p-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M13 1L7 7M1 13L7 7M7 7L1 1M7 7L13 13"
                  stroke="#8F8F8F"
                  strokeWidth="1.5"
                />
              </svg>
            </Link>
          </div>
        </div>

        <TaskForm
          room={room}
          taskWidgetId={taskWidgetId}
          taskList={taskList}
          setTaskList={setTaskList}
        />

        <div className="my-4">
          <input
            type="checkbox"
            onChange={(event) => setShowOnlyChecked(event.target.checked)}
            className="mr-2 border-secondary bg-primary ring-offset-primary "
          />
          <label htmlFor="" className="text-mini">
            Show only checked
          </label>
        </div>
        <hr className="border border-primary my-4 " />
      </div>
      <div className="h-full">
        {taskList && taskList?.length !== 0 && (
          <ul className="max-h-[50%] md:max-h-[65%] h-full flex overflow-y-scroll	flex-col gap-4">
            {!showOnlyChecked
              ? taskList?.map((taskitem) => (
                  <TaskItemForm
                    room={room}
                    taskWidgetId={taskWidgetId}
                    key={taskitem.id}
                    id={taskitem.id}
                    text={taskitem.text}
                    checked={taskitem.checked}
                    order={taskitem.order}
                    taskList={taskList}
                    setTaskList={setTaskList}
                  />
                ))
              : taskList
                  .filter((task) => task.checked)
                  .map((task) => (
                    <TaskItemForm
                      room={room}
                      taskWidgetId={taskWidgetId}
                      key={task.id}
                      id={task.id}
                      text={task.text}
                      checked={task.checked}
                      order={task.order}
                      taskList={taskList}
                      setTaskList={setTaskList}
                    />
                  ))}
          </ul>
        )}
      </div>
    </>
  );
}
