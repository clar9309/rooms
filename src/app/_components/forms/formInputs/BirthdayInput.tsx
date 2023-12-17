import { Field, FieldInputProps, FormikErrors, FormikTouched } from "formik";

type BirthdayInputProps = {
  errors: FormikErrors<{ birthday: string }>;
  touched: FormikTouched<{ birthday: boolean }>;
};

function BirthdayInput(props: BirthdayInputProps) {
  return (
    <div className="min-h-[5.5rem]">
      <div className="grid relative">
        <Field name="birthday">
          {({ field }: { field: FieldInputProps<string> }) => (
            <input
              type="date"
              id="birthday"
              {...field}
              className={`bg-primary text-white h-14 peer placeholder:text-primary focus:outline-none focus:border-secondary focus:border px-5 pt-3 rounded-lg 
          peer-visible:bg-white ${
            props.errors.birthday &&
            props.touched.birthday &&
            "border border-warning"
          }`}
              placeholder="Birthday"
            />
          )}
        </Field>
        <label
          htmlFor="birthday"
          className="absolute left-0 top-1 text-secondary text-sm transition-all px-5
          peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
          peer-focus:top-1 peer-focus:text-sm peer-focus:translate-y-0"
        >
          Birthday
        </label>
      </div>
      {props.errors.birthday && props.touched.birthday && (
        <p className="text-warning mt-2 italic text-right text-sm">
          {props.errors.birthday}
        </p>
      )}
    </div>
  );
}

export default BirthdayInput;
