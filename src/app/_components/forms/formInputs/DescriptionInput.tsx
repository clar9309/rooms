import { Field, ErrorMessage } from "formik";

function DescriptionInput({
  error,
  touched,
}: {
  error: string | undefined;
  touched: boolean | undefined;
}) {
  return (
    <div className="min-h-[10.13rem] flex flex-col">
      <label
        htmlFor="description"
        className="font-medium text-h5 text-darkGrey mb-1"
      >
        Description
      </label>
      <Field
        type="text"
        as="textarea"
        name="description"
        id="description"
        className={`bg-primary text-white h-14 min-h-[7rem] py-2 placeholder:text-darkGrey focus:outline-none focus:border-secondary focus:border px-5 rounded-lg 
           ${error && touched && "border border-warning"}`}
      />

      <ErrorMessage
        className="text-warning mt-2 italic text-right text-sm"
        name="description"
        component="div"
      />
    </div>
  );
}

export default DescriptionInput;
