"use client";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ErrorToast from "../toasts/ErrorToast";
import { Room, TaskItem } from "@prisma/client";

type TaskItemProps = {
  room: Room;
  taskWidgetId: string;
  id: string;
  text: string;
  checked: boolean;
  order: number;
  taskList: TaskItem[];
  setTaskList: (tasks: TaskItem[]) => void;
};

function TaskItemForm({
  room,
  taskWidgetId,
  id,
  text,
  checked,
  order,
  taskList,
  setTaskList,
}: TaskItemProps) {
  const { data: session } = useSession();

  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState<boolean>(false);
  // Add state to manage checked state
  const [isChecked, setIsChecked] = useState(checked);
  const toggleChecked = async () => {
    // Toggle the checked state immediately
    setIsChecked((prevChecked) => !prevChecked);

    // Make the API call
    if (session) {
      try {
        const resp = await fetch("/api/tasks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token.sub}`,
          },
          body: JSON.stringify({
            id: id,
            checked: !isChecked, // Use the inverted state
            order: order,
            updated_by: session.user.id,
            task_widget_fk: taskWidgetId,
            roomId: room.id,
          }),
        });

        if (resp.ok) {
          setSuccess(true);
          const data = await resp.json();

          // Create a new array with the updated task
          const updatedTasks = taskList.map((task) =>
            task.id === data.updatedTask.id ? data.updatedTask : task
          );
          // Update the taskList state with the new array
          setTaskList(updatedTasks);
        } else {
          const data = await resp.json();

          if (data.msg) {
            setErrorMsg(data.msg);
          } else {
            setErrorMsg(data.error[0].message);
          }
        }
      } catch (error) {
        console.error("Error making API call:", error);
      }
    }
  };

  // Handling the order buttons
  const handleMoveUp = async () => {
    const currentIndex = taskList.findIndex((task) => task.id === id);
    if (currentIndex > 0) {
      const updatedTasks = [...taskList];
      [updatedTasks[currentIndex], updatedTasks[currentIndex - 1]] = [
        updatedTasks[currentIndex - 1],
        updatedTasks[currentIndex],
      ];
      setTaskList(updatedTasks);

      // Placeholder for API call to update task order in the database
      if (session) {
        try {
          const resp = await fetch("/api/tasks?orderUpdate=true", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token.sub}`,
            },
            body: JSON.stringify({ tasks: updatedTasks }),
          });

          if (!resp.ok) {
            const data = await resp.json();
            setErrorMsg(data.msg || data.error[0].message);
          }
        } catch (error) {
          console.error("Error making API call:", error);
        }
      }
    }
  };

  const handleMoveDown = async () => {
    const currentIndex = taskList.findIndex((task) => task.id === id);
    if (currentIndex < taskList.length - 1) {
      const updatedTasks = [...taskList];
      [updatedTasks[currentIndex], updatedTasks[currentIndex + 1]] = [
        updatedTasks[currentIndex + 1],
        updatedTasks[currentIndex],
      ];
      setTaskList(updatedTasks);

      // Placeholder for API call to update task order in the database
      if (session) {
        try {
          const resp = await fetch("/api/tasks?orderUpdate=true", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token.sub}`,
            },
            body: JSON.stringify({ tasks: updatedTasks }),
          });

          if (!resp.ok) {
            const data = await resp.json();
            setErrorMsg(data.msg || data.error[0].message);
          }
        } catch (error) {
          console.error("Error making API call:", error);
        }
      }
    }
  };

  const clearError = () => {
    setErrorMsg("");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full items-center">
        <div className="w-[70%] sm:w-[60]">
          <Formik
            initialValues={{
              taskId: id,
              checked: isChecked,
              order: order,
              roomId: room.id,
            }}
            onSubmit={toggleChecked}
          >
            {() => (
              <Form className="flex w-full">
                <div className="w-full flex items-center gap-3">
                  <Field type="hidden" name="roomId" />
                  <div className="w-5">
                    <Field
                      id={id}
                      type="checkbox"
                      checked={isChecked}
                      onChange={toggleChecked}
                      className="m-1 cursor-pointer bg-primary h-5 w-5 focus:ring-1 focus:ring-white focus:ring-offset-0  border border-gray-500 rounded-full"
                    />
                  </div>
                  <label htmlFor={id} className="text-secondary text-sm">
                    {text}
                  </label>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        {/* Arrow up and down button */}
        <div className="w-[30%] sm:w-[40%] flex items-center">
          <div className="flex mx-2 w-full">
            <button
              type="button"
              onClick={handleMoveDown}
              className="hidden sm:block m-1 text-gray-300 text-mini hover:bg-grey hover:bg-opacity-10 rounded-lg transition"
            >
              <svg
                className="w-8"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#888888"
                  d="M12 14.708L6.692 9.4l.708-.708l4.6 4.6l4.6-4.6l.708.708z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleMoveUp}
              className="hidden sm:block m-1 text-gray-300 text-mini hover:bg-grey hover:bg-opacity-10 rounded-lg transition"
            >
              <svg
                className="w-8"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#888888"
                  d="m12 10.108l-4.6 4.6L6.692 14L12 8.692L17.308 14l-.708.708z"
                />
              </svg>
            </button>
          </div>
          <Formik
            initialValues={{
              taskId: id,
            }}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              if (session) {
                const resp = await fetch("/api/tasks", {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.token.sub}`,
                  },
                  body: JSON.stringify({
                    id: values.taskId,
                    task_widget_fk: taskWidgetId,
                    roomId: room.id,
                  }),
                });
                if (resp.ok) {
                  setSuccess(true);
                  const data = await resp.json();
                  const updatedTasks = taskList.filter(
                    (task) => task.id !== data.deletedTask.id
                  );
                  setTaskList(updatedTasks);
                } else {
                  const data = await resp.json();
                  actions.setSubmitting(false);

                  if (data.msg) {
                    setErrorMsg(data.msg);
                  } else {
                    setErrorMsg(data.error[0].message);
                  }
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="ml-auto m-1 text-gray-300">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-mini py-1.5 px-2 rounded-full flex items-center justify-center border border-secondary transition 
                  enabled:hover:border-warning enabled:hover:bg-warning enabled:hover:bg-opacity-5 enabled:hover:text-warning min-w-[4.8rem] min-h-[1.58rem]"
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin h-2 w-2 text-secondary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </div>
                <Field type="hidden" name="taskId" />
                <Field type="hidden" name="roomId" />
                <Field type="hidden" name="roomId" />
              </Form>
            )}
          </Formik>
        </div>
        <ErrorToast msg={errorMsg} onDismiss={clearError} />
      </div>
    </div>
  );
}

export default TaskItemForm;
