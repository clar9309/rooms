import { Field, ErrorMessage } from "formik";

function FirstNameInput({
  error,
  touched,
}: {
  error: string | undefined;
  touched: boolean | undefined;
}) {
  return (
    <div className="min-h-[5.5rem]">
      <div className="grid relative">
        <Field
          type="first_name"
          name="first_name"
          id="first_name"
          className={`bg-primary text-white h-14 peer border border-primary placeholder:text-primary focus:outline-none focus:border-secondary focus:border px-5 pt-3 rounded-lg 
          peer-visible:bg-white ${error && touched && "border-warning"}`}
          placeholder="First name"
        />
        <label
          htmlFor="first_name"
          className="absolute left-0 top-1 text-secondary text-sm transition-all px-5
          peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
          peer-focus:top-1 peer-focus:text-sm peer-focus:translate-y-0"
        >
          First name
        </label>
      </div>
      <ErrorMessage
        className="text-warning mt-2 italic text-right text-sm"
        name="first_name"
        component="div"
      />
    </div>
  );
}

export default FirstNameInput;
