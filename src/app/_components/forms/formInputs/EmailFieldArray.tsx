import { FieldArray, FormikErrors } from "formik";
import { useState } from "react";
import { email } from "@/app/_utils/validation/validations/email-validation";
import { RoomCreateForm } from "@/app/_models/room";
import { useSession } from "next-auth/react";
import { maxParticipants } from "@/app/_utils/validation/validationVariables";
import { ExtendedParticipant } from "@/app/_models/participant";
import { calculateMaxAdditionalParticipants } from "@/app/_utils/validation/schemas/participant-create-schema";

interface EmailFieldArrayProps {
  setFieldValue: (
    field: any,
    value: any
  ) => Promise<void | FormikErrors<RoomCreateForm>>;
  emails: string[];
  emailsError: string | string[] | undefined;
  isEditRoom?: boolean;
  participants?: ExtendedParticipant[];
}

function EmailFieldArray({
  setFieldValue,
  emails,
  emailsError,
  isEditRoom,
  participants,
}: EmailFieldArrayProps) {
  const { data: session } = useSession();
  const [inputEmail, setInputEmail] = useState("");
  const [error, setError] = useState("");

  const handleInviteUser = async () => {
    //Validate email format
    const valResult = email.safeParse(inputEmail);
    if (!valResult.success) {
      setError(valResult.error.errors[0].message);
      return;
    }
    const cleanEmail = inputEmail.toLowerCase().trim();
    let hasError = false;

    if (isEditRoom) {
      //validate that user is not already part of the room
      const alreadyParticipant = participants?.some(
        (participant) => participant.user?.email === cleanEmail
      );
      if (alreadyParticipant) {
        setError("User is already part of the room");
        hasError = true;
      }
      const maxAdditionalParticipants = calculateMaxAdditionalParticipants(
        participants!
      );
      //Validate that no more than 12 users can be added
      if (maxAdditionalParticipants === 0) {
        setError(`Max number of users in a room is ${maxParticipants}`);
        hasError = true;
      }
    } else {
      //Validate that email is not logged user
      if (session?.user.email === cleanEmail) {
        setError("You will automatically be part of the room");
        hasError = true;

        return;
      }

      const updatedEmails = [...emails, cleanEmail];

      //Validate that no more than 12 users can be added
      if (updatedEmails.length >= maxParticipants) {
        setError(`Max number of users in a room is ${maxParticipants}`);
        hasError = true;

        return;
      }

      //Validate that email is not already added
      const isEmailAlreadyAdded = emails.includes(cleanEmail);
      if (isEmailAlreadyAdded) {
        setError("User already added");
        hasError = true;

        return;
      }
    }

    if (!hasError) {
      //check if email exists
      const resp = await fetch(`/api/user/email`, {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail }),
        headers: {
          Authorization: `Bearer ${session?.token.sub}`,
          "Content-Type": "application/json",
        },
      });

      if (resp.ok) {
        //Success
        const data = await resp.json();
        const updatedValues = [...emails, data.userEmail];
        setFieldValue("emails", updatedValues);
        setInputEmail("");
      } else {
        if (resp.status < 500) {
          const data = await resp.json();
          setError(data.error);
        } else {
          setError("An error occurred");
        }
      }
    }
  };

  return (
    <div>
      <div className="min-h-[6.7rem] flex flex-col">
        <label
          htmlFor="email"
          className="font-medium text-h5 text-darkGrey mb-1"
        >
          Invite users
        </label>
        <div className="flex w-full gap-3">
          <input
            value={inputEmail}
            onChange={(e) => {
              setInputEmail(e.target.value);
              setError("");
            }}
            type="text"
            name="email"
            id="email"
            className={`bg-primary w-full text-white h-14 placeholder:text-darkGrey focus:outline-none focus:border-secondary focus:border px-5 rounded-l-lg ${
              error && "border border-warning"
            }`}
            placeholder="Email"
          />
          <button
            type="button"
            className="min-w-[8rem] bg-grey text-white rounded-r-lg transition hover:bg-opacity-80"
            onClick={() => {
              setError("");
              handleInviteUser();
            }}
          >
            Add user
          </button>
        </div>
        {error && (
          <div>
            <span className="text-warning mt-2 italic text-right text-sm">
              {error}
            </span>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="emails"
          className="font-medium text-h5 text-darkGrey mb-1"
        >
          Added users
        </label>
        <FieldArray name="emails">
          {({ remove, form }) => (
            <div className="min-h-[12rem] bg-primary p-4 rounded-lg">
              <div className="flex justify-start items-start gap-2 flex-wrap">
                {form.values.emails.map((email: string, index: number) => (
                  <button
                    className="flex gap-2 items-center bg-dark text-darkGrey p-2 rounded-lg transition enabled:hover:bg-opacity-50"
                    key={email + index}
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <span>{email}</span>
                    <svg
                      className="w-3"
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.8409 12.1342C12.89 12.18 12.9294 12.2352 12.9567 12.2965C12.984 12.3578 12.9987 12.424 12.9999 12.4912C13.0011 12.5583 12.9888 12.625 12.9636 12.6873C12.9385 12.7495 12.901 12.8061 12.8536 12.8536C12.8061 12.901 12.7495 12.9385 12.6873 12.9636C12.625 12.9888 12.5583 13.0011 12.4912 12.9999C12.424 12.9987 12.3578 12.984 12.2965 12.9567C12.2352 12.9294 12.18 12.89 12.1342 12.8409L6.48753 7.19503L0.840861 12.8409C0.746078 12.9292 0.620714 12.9773 0.491179 12.975C0.361645 12.9727 0.238055 12.9202 0.146447 12.8286C0.0548379 12.737 0.00236338 12.6134 7.78982e-05 12.4839C-0.00220758 12.3543 0.0458744 12.229 0.134194 12.1342L5.78003 6.48753L0.134194 0.840861C0.0458744 0.746078 -0.00220758 0.620714 7.78982e-05 0.491179C0.00236338 0.361645 0.0548379 0.238055 0.146447 0.146447C0.238055 0.0548379 0.361645 0.00236338 0.491179 7.78982e-05C0.620714 -0.00220758 0.746078 0.0458744 0.840861 0.134194L6.48753 5.78003L12.1342 0.134194C12.229 0.0458744 12.3543 -0.00220758 12.4839 7.78982e-05C12.6134 0.00236338 12.737 0.0548379 12.8286 0.146447C12.9202 0.238055 12.9727 0.361645 12.975 0.491179C12.9773 0.620714 12.9292 0.746078 12.8409 0.840861L7.19503 6.48753L12.8409 12.1342Z"
                        fill="#8F8F8F"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </FieldArray>

        {emailsError && (
          <div>
            <span className="text-warning mt-2 italic text-right text-sm">
              {emailsError}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailFieldArray;
