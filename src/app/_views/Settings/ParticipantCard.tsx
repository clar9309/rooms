import ErrorToast from "@/app/_components/toasts/ErrorToast";
import {
  ExtendedParticipant,
  ParticipantDeleteForm,
} from "@/app/_models/participant";
import { ExtendedRoom } from "@/app/_models/room";
import participantdeleteschema from "@/app/_utils/validation/schemas/participant-delete-schema";
import { User } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface ParticipantCardProps {
  user?: User;
  room: ExtendedRoom;
  setParticipants: (participants: ExtendedParticipant[]) => void;
  participants?: ExtendedParticipant[];
}

function ParticipantCard(props: ParticipantCardProps) {
  const { data: session } = useSession();
  const [errorMsg, setErrorMsg] = useState("");
  const { user } = props;

  const clearError = () => {
    setErrorMsg("");
  };

  return (
    <li className="flex justify-between items-center py-3 border-b border-grey border-opacity-30">
      <div className="grid">
        <span>
          {user?.first_name} {user?.last_name}
          {session?.user.id === user?.id && (
            <span className=" text-secondary"> (you)</span>
          )}
        </span>
        <span className="text-xs text-secondary">{user?.email}</span>
      </div>
      <div>
        {props.room.admin_fk === user?.id ? (
          <span>Owner</span>
        ) : (
          <>
            <Formik
              initialValues={{ userId: props.user!.id, roomId: props.room.id }}
              validationSchema={toFormikValidationSchema(
                participantdeleteschema
              )}
              onSubmit={async (values: ParticipantDeleteForm, actions) => {
                actions.setSubmitting(true);

                if (session) {
                  const resp = await fetch(`/api/participants`, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${session.token.sub}`,
                    },
                    body: JSON.stringify({ ...values }),
                  });
                  if (resp.ok) {
                    const data = await resp.json();

                    const updatedParticipants = props.participants?.filter(
                      (participant) => participant.id !== data.user.id
                    );

                    props.setParticipants(updatedParticipants!);
                  } else {
                    setErrorMsg("An error occurred");
                  }
                }
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form className="grid gap-3">
                    <Field type="hidden" name="roomId" id="roomId" />
                    <Field type="hidden" name="userId" id="userId" />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-xs py-1.5 px-6 rounded-full flex items-center justify-center border border-secondary transition hover:border-warning hover:bg-warning hover:bg-opacity-5 hover:text-warning min-w-[4.8rem]"
                    >
                      {isSubmitting ? (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                        <span>Kick</span>
                      )}
                    </button>
                  </Form>
                );
              }}
            </Formik>
            <ErrorToast msg={errorMsg} onDismiss={clearError} />
          </>
        )}
      </div>
    </li>
  );
}

export default ParticipantCard;
