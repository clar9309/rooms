"use client";
import { Field, Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { CreateTaskForm } from "@/app/_models/tasks";
import taskSchema from "@/app/_utils/validation/schemas/create-task-schema";
import TaskInput from "./formInputs/TaskInput";
import { useState } from "react";
import ErrorToast from "../toasts/ErrorToast";
import { Room, TaskItem } from "@prisma/client";
import { useSession } from "next-auth/react";

interface TaskWidgetProps {
  room: Room;
  taskWidgetId: string;
  taskList?: TaskItem[];
  setTaskList: (taskList: TaskItem[]) => void;
}

function TaskForm({
  room,
  taskWidgetId,
  taskList,
  setTaskList,
}: TaskWidgetProps) {
  const { data: session } = useSession();

  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState<boolean>(false);

  const clearError = () => {
    setErrorMsg("");
  };

  return (
    <div>
      <Formik
        initialValues={{
          text: "",
          task_widget_fk: taskWidgetId, // Set task_widget_fk based on task prop
          roomId: room.id,
        }}
        validationSchema={toFormikValidationSchema(taskSchema)}
        onSubmit={async (values: CreateTaskForm, actions) => {
          actions.setSubmitting(true);
          if (session) {
            const resp = await fetch("/api/tasks", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.token.sub}`,
              },
              body: JSON.stringify({
                text: values.text,
                task_widget_fk: values.task_widget_fk,
                created_by_fk: session.user.id,
                roomId: values.roomId,
              }),
            });
            if (resp.ok) {
              setSuccess(true);
              const data = await resp.json();
              if (taskList) {
                const updatedTasks = [...taskList, data.createdTask];
                setTaskList(updatedTasks);
              } else {
                const updatedTasks = [data.createdTask];
                setTaskList(updatedTasks);
              }

              actions.resetForm({
                values: {
                  text: "",
                  task_widget_fk: taskWidgetId,
                  roomId: room.id,
                },
              });
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
        {({ isSubmitting, errors, touched }) => (
          <Form className="flex gap-2 w-full mt-3">
            <TaskInput error={errors.text} touched={touched.text} />

            <Field type="hidden" name="task_widget_fk" />
            <Field type="hidden" name="created_by_fk" />
            <Field type="hidden" name="roomId" />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-grey text-sm md:text-h5 min-h-[3rem] w-[30%]
                rounded-r-lg flex items-center justify-center transition enabled:hover:bg-opacity-50"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                <span>Add Task</span>
              )}
            </button>
          </Form>
        )}
      </Formik>
      <ErrorToast msg={errorMsg} onDismiss={clearError} />
    </div>
  );
}

export default TaskForm;
