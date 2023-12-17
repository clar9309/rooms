import { Form, Formik } from "formik";
import ErrorToast from "../toasts/ErrorToast";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import SearchInput from "./formInputs/SearchInput";
import { City } from "@/app/_models/location";

interface SearchCitiesFormProps {
  setCityResult: (cities: City[]) => void;
  cityResult: City[] | [];
}

function SearchCitiesForm({
  setCityResult,
  cityResult,
}: SearchCitiesFormProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const { data: session } = useSession();

  const clearError = () => {
    setErrorMsg("");
  };
  return (
    <>
      <Formik
        initialValues={{ search: "" }}
        validationSchema={toFormikValidationSchema(
          z.object({
            search: z.string({
              required_error: `A value is required`,
              invalid_type_error: `Value must be a string`,
            }),
          })
        )}
        onSubmit={async (values: { search: string }, actions) => {
          actions.setSubmitting(true);
          if (session) {
            const resp = await fetch(
              `/api/location?searchQuery=${values.search}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${session.token.sub}`,
                },
              }
            );
            if (resp.ok) {
              const data = await resp.json();
              setCityResult(data.citiesResult);
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
          isValid,
          setFieldValue,
          setErrors,
        }) => {
          return (
            <Form className="flex gap-3 xxl:px-20">
              <SearchInput
                error={errors.search}
                touched={touched.search}
                setFieldValue={setFieldValue}
                cityResult={cityResult}
                setErrors={setErrors}
              >
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="bg-grey text-h5 py-4 mx-auto min-w-[6rem] md:min-w-[10rem] rounded-r-lg flex items-center justify-center min-h-[3.13rem] transition enabled:hover:bg-opacity-50"
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
                    <span>Search</span>
                  )}
                </button>
              </SearchInput>
            </Form>
          );
        }}
      </Formik>
      <ErrorToast msg={errorMsg} onDismiss={clearError} />
    </>
  );
}

export default SearchCitiesForm;
