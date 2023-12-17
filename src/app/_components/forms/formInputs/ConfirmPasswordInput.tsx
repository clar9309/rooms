import { Field, ErrorMessage } from "formik";

function ConfirmPasswordInput({
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
          type="password"
          name="password_confirm"
          id="password_confirm"
          className={`bg-primary text-white h-14 peer placeholder:text-primary focus:outline-none focus:border-secondary focus:border px-5 pt-3 rounded-lg 
          peer-visible:bg-white ${error && touched && "border border-warning"}`}
          placeholder="Confirm password"
        />
        <label
          htmlFor="password_confirm"
          className="absolute left-0 top-1 text-secondary text-sm transition-all px-5
          peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
          peer-focus:top-1 peer-focus:text-sm peer-focus:translate-y-0"
        >
          Confirm password
        </label>
      </div>
      <ErrorMessage
        className="text-warning mt-2 italic text-right text-sm"
        name="password_confirm"
        component="div"
      />
    </div>
  );
}

export default ConfirmPasswordInput;
