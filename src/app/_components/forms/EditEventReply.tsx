"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ExpandedEventAttendee } from "@/app/_models/event";

function EditEventReply({
  attendees,
  eventId,
  setAttendees,
}: {
  attendees?: ExpandedEventAttendee[];
  eventId: string;
  setAttendees: (attendees: any) => void;
}) {
  const { data: session } = useSession();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [replyVal, setReplyVal] = useState("");

  useEffect(() => {
    if (session?.user) {
      const defaultVal = attendees?.find((a) => a.user_id === session!.user.id);
      setReplyVal(defaultVal ? defaultVal.reply : "");
    }
  }, [session]);

  const options = [
    {
      title: "Accept",
      value: "accepted",
    },
    {
      title: "Decline",
      value: "declined",
    },
    {
      title: "No reply",
      value: "pending",
    },
  ];

  const handleOnChange = async (value: any) => {
    setReplyVal(value);
    if (session) {
      const resp = await fetch(`/api/events`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.token.sub}`,
        },
        body: JSON.stringify({ reply: value, eventId: eventId }),
      });
      if (resp.ok) {
        const data = await resp.json();

        setAttendees((prev: any) =>
          prev.map((a: any) => {
            if (a.user_id === data.updatedAttendee.user_id) {
              return { ...a, reply: data.updatedAttendee.reply };
            }
            return a;
          })
        );
      }
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <label htmlFor={"reply"} className="font-medium text-h5 text-darkGrey">
        Your reply
      </label>
      <div className="grid relative min-w-[8rem]">
        <select
          name="reply"
          id="reply"
          value={replyVal}
          className={`bg-primary text-white h-10 placeholder:text-darkGrey focus:outline-none focus:border-secondary focus:border px-5 rounded-lg hover:cursor-pointer`}
          onFocus={() => setOptionsOpen(true)}
          onBlur={() => setOptionsOpen(false)}
          onChange={(event: any) => {
            setOptionsOpen(false);
            handleOnChange(event.target.value);
          }}
        >
          {options.map((opt) => {
            return (
              <option
                key={opt.value}
                value={opt.value}
                className="text-[15px] px-5"
                style={{ fontFamily: "Arial" }}
              >
                {opt.title}
              </option>
            );
          })}
        </select>
        <span
          className={`absolute top-1/2 -translate-y-1/2 right-3 transition-transform duration-500 ease-in-out ${
            optionsOpen && "rotate-180 "
          }`}
        >
          <svg
            className="h-2"
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
export default EditEventReply;
