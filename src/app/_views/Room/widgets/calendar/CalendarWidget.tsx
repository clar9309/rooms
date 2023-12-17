import { CalendarDay, ExpandedEvent } from "@/app/_models/event";
import CalendarDays from "./CalendarDays";
import CalendarEvents from "./CalendarEvents";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CalendarWidgetProps {
  calendarDayData: CalendarDay[];
  roomId: string;
}

function CalendarWidget({ calendarDayData, roomId }: CalendarWidgetProps) {
  const [activeDate, setActiveDate] = useState(calendarDayData[0].fullDate);
  const [events, setEvents] = useState<ExpandedEvent[]>([]);
  const { data: session } = useSession();

  async function fetchEvents(fullDate?: string) {
    let date = fullDate ? fullDate : activeDate;

    const resp = await fetch(`/api/events?roomId=${roomId}&date=${date}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session!.token.sub}`,
      },
    });

    if (resp.ok) {
      const data = await resp.json();
      setEvents(data.filteredEvents);
    } else {
      console.log("Error occurred while fetching events");
    }

    return null;
  }

  useEffect(() => {
    if (session && session?.user) {
      fetchEvents();
    }
  }, [session]);

  const onCallBack = (fullDate: string) => {
    setActiveDate(fullDate);
    fetchEvents(fullDate);
  };

  return (
    <div className="w-full lg:w-1/2 max-w-[39.5rem] relative ">
      <CalendarDays
        calendarDayData={calendarDayData}
        onCallBack={onCallBack}
        activeDate={activeDate}
      />
      <div className="flex my-2">
        <Link
          href={`/rooms/${roomId}/events`}
          className="text-xs text-right ml-auto text-darkGrey transition hover:text-white"
        >
          All events
        </Link>
      </div>
      <CalendarEvents events={events} />
    </div>
  );
}

export default CalendarWidget;
