import { Form, Formik } from "formik";
import TitleInput from "./formInputs/TitleInput";
import { RoomCreateForm } from "@/app/_models/room";
import createroomschema from "@/app/_utils/validation/schemas/room-create-schema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import EmailFieldArray from "./formInputs/EmailFieldArray";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorToast from "../toasts/ErrorToast";

function CreateRoomForm() {
  const [errorMsg, setErrorMsg] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const clearError = () => {
    setErrorMsg("");
  };

  return (
    <div>
      <h3 className="text-h2 font-normal mb-6">Create new room</h3>
      <Formik
        initialValues={{ title: "", emails: [] }}
        validationSchema={toFormikValidationSchema(createroomschema)}
        onSubmit={async (values: RoomCreateForm, actions) => {
          actions.setSubmitting(true);

          if (session) {
            const resp = await fetch(`/api/rooms`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session.token.sub}`,
              },
              body: JSON.stringify({ ...values }),
            });

            if (resp.ok) {
              const data = await resp.json();
              router.push(`/rooms/${data.newRoom.id}`);
            } else {
              actions.setSubmitting(false);
              setErrorMsg("An error occurred");
            }
          }
        }}
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
          <Form>
            <TitleInput
              error={errors.title}
              touched={touched.title}
              placeholder="Datababes"
            />

            <EmailFieldArray
              setFieldValue={setFieldValue}
              emails={values.emails}
              emailsError={errors.emails}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-btn min-w-[12rem] min-h-[3.13rem] mt-6 mx-auto"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-4 w-4 text-primary"
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
                <span>Create room</span>
              )}
            </button>
          </Form>
        )}
      </Formik>
      <ErrorToast msg={errorMsg} onDismiss={clearError} />
    </div>
  );
}

export default CreateRoomForm;
