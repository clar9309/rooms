"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { FormattedCalenderEvent } from "@/app/_models/event";
import { useState } from "react";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import CreateEventForm from "@/app/_components/forms/CreateEventForm";
import ErrorToast from "@/app/_components/toasts/ErrorToast";
import BreadCrumb from "@/app/_components/navigation/Breadcrumb";
import dynamic from "next/dynamic";

const DynamicModal = dynamic(() => import("@/app/_components/modals/Modal"), {
  ssr: false,
});

interface EventsViewProps {
  roomEvents: FormattedCalenderEvent[] | null;
  roomId?: string;
  roomOptions: { title: string; id: string }[];
  roomTitle?: string;
}

function EventsView({
  roomEvents,
  roomId,
  roomOptions,
  roomTitle,
}: EventsViewProps) {
  const [events, setEvents] = useState(roomEvents || []);
  const [isOpen, setIsOpen] = useState(false);
  const [chosenDate, setChosenDate] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const options = {
    eventBackgroundColor: "rgba(77, 101, 187, 0.3)",
    eventBorderColor: "rgba(77, 101, 187, 0.3)",
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  };

  const clearResponseMsg = () => {
    setResponseMsg("");
  };

  const onCallBack = (event: FormattedCalenderEvent | null) => {
    if (event) {
      setEvents([...events, event]);
      setResponseMsg("Successfully created a new event");
      setIsOpen(false);
    } else {
      setResponseMsg("An error occurred");
    }
  };

  return (
    <main>
      <BreadCrumb
        links={[
          { title: roomTitle!, url: `/rooms/${roomId}` },
          { title: "Events", url: `/rooms/${roomId}/events` },
        ]}
      />
      <div className="calendar-container font-body">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          dateClick={(event) => {
            setIsOpen(true);
            setChosenDate(event.dateStr);
          }}
          editable={true}
          events={events && ([...events] as EventSourceInput)}
          {...(options as any)}
        />
      </div>
      {isOpen && (
        <DynamicModal setIsOpen={setIsOpen}>
          <CreateEventForm
            defaultRoom={roomId}
            options={roomOptions}
            chosenDate={chosenDate}
            onCallBack={onCallBack}
          />
        </DynamicModal>
      )}
      <ErrorToast msg={responseMsg} onDismiss={clearResponseMsg} />
    </main>
  );
}
export default EventsView;
