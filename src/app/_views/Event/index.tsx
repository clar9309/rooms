"use client";
import DeleteEventForm from "@/app/_components/forms/DeleteEventForm";
import EditEventReply from "@/app/_components/forms/EditEventReply";
import BreadCrumb from "@/app/_components/navigation/Breadcrumb";
import ErrorToast from "@/app/_components/toasts/ErrorToast";
import { ExpandedEvent, ExpandedEventAttendee } from "@/app/_models/event";
import { formatDate } from "@/app/_utils/helpers/date";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

interface EventViewProps {
  roomData: { id: string; title: string };
  eventData: ExpandedEvent;
}

function EventView({ roomData, eventData }: EventViewProps) {
  const { data: session } = useSession();
  const [responseMsg, setResponseMsg] = useState("");
  const [attendees, setAttendees] = useState<
    ExpandedEventAttendee[] | undefined
  >(eventData.attendees);

  const clearResponseMsg = () => {
    setResponseMsg("");
  };

  return (
    <main className="mb-4">
      <BreadCrumb
        links={[
          { title: roomData.title, url: `/rooms/${roomData.id}` },
          { title: "Events", url: `/rooms/${roomData.id}/events` },
          {
            title: eventData.title,
            url: `/rooms/${roomData.id}/events/${eventData.id}`,
            isCurrent: true,
          },
        ]}
      />
      <h2 className="text-h2 md:text-h1 mb-7 mt-2">{eventData.title}</h2>
      <div className="lg:flex lg:gap-2">
        <div className="lg:w-[70%] xl:w-3/4 xxl:w-4/5 bg-dark rounded-xl p-7 xxl:px-14">
          <div className="flex justify-between flex-wrap">
            <h3 className="text-h3 mb-2 flex gap-3 flex-wrap">
              <span>{formatDate(eventData.start_time, true)}</span>
              {eventData.end_time ? (
                <>
                  <span>-</span>
                  <span>{formatDate(eventData.end_time, true)}</span>
                </>
              ) : (
                <span className="text-darkGrey font-normal">All day</span>
              )}
            </h3>
            {session && (
              <div>
                {session?.user.id !== eventData.admin_fk ? (
                  <EditEventReply
                    attendees={eventData.attendees}
                    eventId={eventData.id}
                    setAttendees={setAttendees}
                  />
                ) : (
                  <DeleteEventForm
                    eventId={eventData.id}
                    roomId={roomData.id}
                    setResponseMsg={setResponseMsg}
                  />
                )}
              </div>
            )}
          </div>
          <div className="mt-8">
            <h3 className="text-h5 font-medium text-darkGrey mb-1">
              Description
            </h3>
            <p className="max-w-[70ch] text-lg">
              {eventData.description
                ? eventData.description
                : "No description available"}
            </p>
            <h3 className="text-h5 font-medium text-darkGrey mb-1 mt-6">
              Location
            </h3>
            <p className="max-w-[70ch] text-lg">
              {eventData.location
                ? eventData.location
                : "No location available"}
            </p>
          </div>
        </div>
        <div className="bg-dark rounded-xl lg:w-[30%] xl:w-1/4 xxl:w-1/5 flex flex-col">
          <div className="p-7">
            <h3 className="text-h3 mb-5">Attendees</h3>
            <ul className="h-full flex flex-col gap-4">
              {attendees?.map((a) => {
                return (
                  <li
                    key={a.event_id + a.user_id}
                    className="flex gap-2 items-center"
                  >
                    <div className="relative min-w-[3rem] h-full min-h-[3rem] overflow-hidden rounded-full">
                      <Image
                        src={
                          a.user?.avatar
                            ? a.user.avatar.formatted_url
                            : "/default_avatar.png"
                        }
                        alt={`Profile image ${a.user?.first_name}`}
                        style={{ objectFit: "cover" }}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
                        className="filter group-hover:brightness-90 transition"
                      />
                    </div>
                    <div className="grid">
                      <h4 className="text-sm">
                        {a.user?.first_name} {a.user?.last_name}
                      </h4>

                      <span className="text-xs text-secondary">
                        {a.user?.email}
                      </span>
                    </div>
                    <div className="ml-auto text-sm font-medium">
                      {a.user?.id === eventData.admin_fk ? (
                        <p className="text-info">Organizer</p>
                      ) : (
                        <p
                          className={`capitalize ${
                            a.reply === "accepted"
                              ? "text-success"
                              : a.reply === "declined"
                              ? "text-warning"
                              : "text-darkGrey"
                          }`}
                        >
                          {a.reply}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <ErrorToast msg={responseMsg} onDismiss={clearResponseMsg} />
    </main>
  );
}

export default EventView;
