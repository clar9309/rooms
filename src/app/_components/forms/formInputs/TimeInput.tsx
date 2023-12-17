import { Field, ErrorMessage } from "formik";

function TimeInput({
  error,
  touched,
  name,
  label,
}: {
  error: string | undefined;
  touched: boolean | undefined;
  name: string;
  label: string;
}) {
  return (
    <div className="min-h-[6.7rem] flex flex-col w-[25%]">
      <label htmlFor={name} className="font-medium text-h5 text-darkGrey mb-1">
        {label}
      </label>
      <Field
        type="time"
        name={name}
        id={name}
        className={`bg-primary text-white h-14 placeholder:text-darkGrey focus:outline-none focus:border-secondary focus:border px-5 rounded-lg text-center 
           ${error && touched && "border border-warning"}`}
      />

      <ErrorMessage
        className="text-warning mt-2 italic text-right text-sm"
        name={name}
        component="div"
      />
    </div>
  );
}

export default TimeInput;
