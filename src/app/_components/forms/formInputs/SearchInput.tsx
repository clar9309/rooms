import { City } from "@/app/_models/location";
import { Field, ErrorMessage, FormikErrors } from "formik";
import { useEffect } from "react";

function SearchInput({
  error,
  touched,
  children,
  cityResult,
  setFieldValue,
  setErrors,
}: {
  error: string | undefined;
  touched: boolean | undefined;
  children: React.ReactNode;
  cityResult: City[] | [];
  setFieldValue: (
    field: any,
    value: any,
    validate?: boolean
  ) => Promise<void | FormikErrors<{ search: string }>>;
  setErrors: any;
}) {
  useEffect(() => {
    if (cityResult && cityResult.length === 0) {
      setFieldValue("search", "", false);
      setErrors({});
    }
  }, [cityResult]);
  return (
    <div className="min-h-[5.3rem] flex flex-col w-full">
      <label
        htmlFor="search"
        hidden
        className="font-medium text-h5 text-darkGrey mb-1"
      >
        City
      </label>
      <div className="flex gap-2 w-full">
        <Field
          type="text"
          name="search"
          id="search"
          className={`bg-primary  w-full text-white h-14 placeholder:text-darkGrey focus:outline-none focus:border-secondary focus:border px-5 rounded-l-lg 
           ${error && touched && "border border-warning"}`}
          placeholder="Copenhagen"
        />
        {children}
      </div>
      <ErrorMessage
        className="text-warning mt-2 italic text-right text-sm"
        name="search"
        component="div"
      />
    </div>
  );
}

export default SearchInput;
