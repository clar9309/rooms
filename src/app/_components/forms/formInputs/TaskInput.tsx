import { Field, ErrorMessage } from "formik";

function TaskInput({
  error,
  touched,
}: {
  error: string | undefined;
  touched: boolean | undefined;
}) {
  return (
    <div className="flex flex-col w-[70%]">
      <label hidden htmlFor="text"></label>
      <Field
        type="text"
        name="text"
        id="text"
        className={`bg-primary text-white h-14 placeholder:text-darkGrey focus:outline-none focus:border-secondary focus:border px-5 rounded-l-lg 
           ${error && touched && "border border-warning"}`}
        placeholder={"Do the dishes"}
      />

      <ErrorMessage
        className="text-warning mt-2 italic text-right text-sm"
        name="text"
        component="div"
      />
    </div>
  );
}

export default TaskInput;
