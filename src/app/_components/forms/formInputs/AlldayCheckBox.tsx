import { Field, ErrorMessage } from "formik";

function TimeInput({}: {}) {
  return (
    <div className="flex gap-2 items-center">
      <Field
        type="checkbox"
        name={"allDay"}
        id={"allDay"}
        className={`bg-primary checked:bg-info text-bg_black h-5 w-5 placeholder:text-darkGrey focus:outline-none focus:border-secondary focus:border hover:cursor-pointer px-5 rounded-lg 
        `}
      />
      <label
        htmlFor={"allDay"}
        className="font-medium text-h5 text-darkGrey mb-1"
      >
        All day
      </label>
    </div>
  );
}

export default TimeInput;
