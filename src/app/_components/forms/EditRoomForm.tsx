"use client";
import { Field, Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useState } from "react";
import ErrorToast from "../toasts/ErrorToast";
import { useSession } from "next-auth/react";
import { ExtendedRoom, RoomEditForm } from "@/app/_models/room";
import CoverFileInput from "./formInputs/CoverFileInput";
import TitleInput from "./formInputs/TitleInput";
import editroomschema from "@/app/_utils/validation/schemas/room-edit-schema";

interface EditRoomFormProps {
  room: ExtendedRoom;
  setRoom: (room: ExtendedRoom) => void;
}

function EditRoomForm(props: EditRoomFormProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const { data: session } = useSession();
  const [editValues, setEditValues] = useState<RoomEditForm>({
    title: props.room.title,
    roomId: props.room.id,
    cover_img: "",
  });

  const clearError = () => {
    setErrorMsg("");
  };

  return (
    <div>
      <h2 className="text-h3 font-medium hidden lg:block">Edit Room</h2>
      <Formik
        initialValues={editValues}
        validationSchema={toFormikValidationSchema(editroomschema)}
        onSubmit={async (values: RoomEditForm, actions) => {
          actions.setSubmitting(true);

          if (session) {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("roomId", values.roomId);

            formData.append("cover_img", values.cover_img);

            setEditValues(values);
            const resp = await fetch(`/api/rooms`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${session.token.sub}`,
              },
              body: formData,
            });
            if (resp.ok) {
              const data = await resp.json();
              if (data.updatedRoom) {
                props.setRoom(data.updatedRoom);
              }
            } else {
              setErrorMsg("An error occurred");
            }
          }
        }}
      >
        {({
          isSubmitting,
          errors,
          touched,
          setFieldValue,
          isValid,
          setFieldTouched,
          isValidating,
        }) => {
          return (
            <Form className="grid gap-3 xxl:px-20">
              <CoverFileInput
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                error={errors.cover_img}
                touched={touched.cover_img}
                roomData={props.room}
                isValidating={isValidating}
              />

              <TitleInput
                error={errors.title}
                touched={touched.title}
                placeholder="Datababes"
              />
              <Field type="hidden" name="roomId" id="roomId" />

              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="secondary-btn min-w-[12rem] min-h-[3.13rem] mx-auto"
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
                  <span>Save</span>
                )}
              </button>
            </Form>
          );
        }}
      </Formik>
      <ErrorToast msg={errorMsg} onDismiss={clearError} />
    </div>
  );
}

export default EditRoomForm;
