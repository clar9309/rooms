import { EventCreateForm } from "@/app/_models/event";
import { Field, FormikErrors } from "formik";
import { useState } from "react";

interface CustomSelectProps {
  options?: { title: string; id: string }[];
  error: string | undefined;
  touched: boolean | undefined;
  setFieldValue: (
    field: any,
    value: any
  ) => Promise<
    void | FormikErrors<EventCreateForm> | FormikErrors<{ reply: string }>
  >;
  label: string;
  name: string;
}

function CustomSelect(props: CustomSelectProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);

  return (
    <div className="min-h-[6.7rem] flex flex-col w-full md:w-1/2">
      <label
        htmlFor={props.name}
        className="font-medium text-h5 text-darkGrey mb-1"
      >
        {props.label}
      </label>
      <div className="grid relative">
        <Field
          as="select"
          onFocus={() => setOptionsOpen(true)}
          onBlur={() => setOptionsOpen(false)}
          onChange={(event: any) => {
            setOptionsOpen(false);
            props.setFieldValue(props.name, event.target.value);
          }}
          name={props.name}
          className={`bg-primary text-white h-14 placeholder:text-darkGrey focus:outline-none focus:border-secondary focus:border px-5 rounded-lg 
           ${props.error && props.touched && "border border-warning"}`}
        >
          {props.options?.map((opt) => {
            return (
              <option
                key={opt.id}
                value={opt.id}
                className="text-[15px] px-5"
                style={{ fontFamily: "Arial" }}
              >
                {opt.title}
              </option>
            );
          })}
        </Field>
        <span
          className={`absolute top-1/2 -translate-y-1/2 right-5 transition-transform duration-500 ease-in-out ${
            optionsOpen && "rotate-180 "
          }`}
        >
          <svg
            className="h-3"
            width="22"
            height="14"
            viewBox="0 0 22 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.2625 0.375H0.7375C0.121875 0.375 -0.221875 1.025 0.159375 1.46875L10.4219 13.3687C10.7156 13.7094 11.2812 13.7094 11.5781 13.3687L21.8406 1.46875C22.2219 1.025 21.8781 0.375 21.2625 0.375Z"
              fill="#8B9093"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default CustomSelect;
