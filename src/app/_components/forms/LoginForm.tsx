"use client";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { UserCredentials } from "@/app/_models/user";
import userloginschema from "@/app/_utils/validation/schemas/user-login-schema";
import EmailInput from "./formInputs/EmailInput";
import PasswordInput from "./formInputs/PasswordInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorToast from "../toasts/ErrorToast";

function LoginForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const clearError = () => {
    setErrorMsg("");
  };

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={toFormikValidationSchema(userloginschema)}
        onSubmit={async (values: UserCredentials, actions) => {
          actions.setSubmitting(true);

          const loginData = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          if (loginData?.error) {
            //next-auth bug, returns ok 200 even if error occurs
            setErrorMsg(loginData.error);
            actions.setSubmitting(false);
          } else {
            router.push("/rooms");
            router.refresh();
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="grid gap-3">
            <EmailInput error={errors.email} touched={touched.email} />

            <PasswordInput error={errors.password} touched={touched.password} />

            <button
              type="submit"
              disabled={isSubmitting}
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
                <span>Log in</span>
              )}
            </button>
          </Form>
        )}
      </Formik>
      <ErrorToast msg={errorMsg} onDismiss={clearError} />
    </div>
  );
}

export default LoginForm;
