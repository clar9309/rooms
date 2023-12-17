import { Field, ErrorMessage } from "formik";

function LocationInput({
  error,
  touched,
}: {
  error: string | undefined;
  touched: boolean | undefined;
}) {
  return (
    <div className="min-h-[6.7rem] flex flex-col w-full md:w-1/2">
      <label
        htmlFor="location"
        className="font-medium text-h5 text-darkGrey mb-1"
      >
        Location
      </label>
      <Field
        type="text"
        name="location"
        id="location"
        className={`bg-primary text-white h-14 placeholder:text-darkGrey focus:outline-none focus:border-secondary focus:border px-5 rounded-lg 
           ${error && touched && "border border-warning"}`}
        placeholder={"In my backyard"}
      />

      <ErrorMessage
        className="text-warning mt-2 italic text-right text-sm"
        name="location"
        component="div"
      />
    </div>
  );
}

export default LocationInput;
