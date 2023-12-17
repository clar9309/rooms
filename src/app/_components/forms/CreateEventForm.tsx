import { Formik, Form } from "formik";
import { useSession } from "next-auth/react";
import { useState } from "react";
import TitleInput from "./formInputs/TitleInput";
import { EventCreateForm, FormattedCalenderEvent } from "@/app/_models/event";
import DescriptionInput from "./formInputs/DescriptionInput";
import LocationInput from "./formInputs/LocationInput";
import createeventschema from "@/app/_utils/validation/schemas/event-create-schema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import DateInput from "./formInputs/DateInput";
import TimeInput from "./formInputs/TimeInput";
import AlldayCheckBox from "./formInputs/AlldayCheckBox";
import CustomSelect from "./formInputs/CustomSelect";

interface CreateEventFormProps {
  options?: { title: string; id: string }[];
  chosenDate: string;
  onCallBack: (event: FormattedCalenderEvent | null) => void;
  defaultRoom?: string;
}

const getTimeNow = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const defaultStartTime = `${hours}:${minutes}`;
  return defaultStartTime;
};

function CreateEventForm({
  options,
  chosenDate,
  onCallBack,
  defaultRoom,
}: CreateEventFormProps) {
  const [formValues, setFormValues] = useState<EventCreateForm>({
    title: "",
    description: "",
    roomId: defaultRoom ? defaultRoom : options![0].id,
    location: "",
    startDate: chosenDate,
    startTime: getTimeNow(),
    endDate: chosenDate,
    endTime: getTimeNow(),
    allDay: false,
  });
  const { data: session } = useSession();

  return (
    <div>
      <h3 className="text-h2 font-normal mb-6">Create new event</h3>
      <Formik
        initialValues={formValues}
        validationSchema={toFormikValidationSchema(createeventschema)}
        onSubmit={async (values: EventCreateForm, actions) => {
          actions.setSubmitting(true);
          setFormValues(values);
          if (session) {
            const resp = await fetch(`/api/events`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session.token.sub}`,
              },
              body: JSON.stringify({ ...values }),
            });

            if (resp.ok) {
              const data = await resp.json();
              const newEvent = {
                id: data.newEvent.id,
                url: `/rooms/${data.newEvent.room_id}/events/${data.newEvent.id}`,
                start: data.newEvent.start_time,
                title: data.newEvent.title,
                allDay: data.newEvent.all_day,
                end: data.newEvent.end_time,
              };
              onCallBack(newEvent);
            } else {
              actions.setSubmitting(false);
              onCallBack(null);
            }
          }
        }}
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => {
          return (
            <Form>
              <TitleInput
                error={errors.title}
                touched={touched.title}
                placeholder="Housewarming"
              />
              <div className="flex gap-3 w-full flex-wrap md:flex-nowrap">
                <CustomSelect
                  setFieldValue={setFieldValue}
                  options={options}
                  error={errors.roomId}
                  touched={touched.roomId}
                  label={"Room*"}
                  name={"roomId"}
                />
                <LocationInput
                  error={errors.location}
                  touched={touched.location}
                />
              </div>

              <DescriptionInput
                error={errors.description}
                touched={touched.description}
              />

              <div className="flex gap-4 flex-wrap md:flex-nowrap">
                <div className="flex w-full gap-3 md:w-1/2">
                  <DateInput
                    error={errors.startDate}
                    touched={touched.startDate}
                    label={"Start date"}
                    name={"startDate"}
                  />
                  <TimeInput
                    error={errors.startTime}
                    touched={touched.startTime}
                    label={"Start time"}
                    name={"startTime"}
                  />
                </div>

                <div className="flex w-full gap-3 md:w-1/2">
                  {!values.allDay && (
                    <>
                      <DateInput
                        error={errors.startDate}
                        touched={touched.startDate}
                        label={"End date"}
                        name={"endDate"}
                      />
                      <TimeInput
                        error={errors.endTime}
                        touched={touched.endTime}
                        label={"End time"}
                        name={"endTime"}
                      />
                    </>
                  )}
                </div>
              </div>
              <AlldayCheckBox />

              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-btn min-w-[12rem] min-h-[3.13rem] mt-6 md:mt-2 mx-auto"
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin h-4 w-4 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <span>Create event</span>
                )}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
export default CreateEventForm;
