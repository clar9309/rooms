import { requireAuthentication } from "@/app/_middleware/authentication";
import { FormattedCalenderEvent } from "@/app/_models/event";
import CalendarView from "@/app/_views/Calendar";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma-client";

async function getData(id: string) {
  const rooms = await db.room.findMany({
    where: {
      participants: {
        some: {
          user_id: id,
        },
      },
    },
    select: {
      title: true,
      id: true,
    },
  });

  const userEvents = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      eventsAttending: {
        select: {
          event: {
            select: {
              id: true,
              title: true,
              start_time: true,
              end_time: true,
              all_day: true,
              room_id: true,
            },
          },
        },
      },
    },
  });

  if (userEvents?.eventsAttending && userEvents.eventsAttending.length !== 0) {
    const formattedEvents: FormattedCalenderEvent[] =
      userEvents.eventsAttending.map((event) => {
        const formattedEvent: FormattedCalenderEvent = {
          id: event.event.id,
          url: `/rooms/${event.event.room_id}/events/${event.event.id}`,
          start: event.event.start_time,
          title: event.event.title,
          allDay: event.event.all_day,
        };

        if (event.event.end_time) {
          formattedEvent.end = event.event.end_time;
        }

        return formattedEvent;
      });

    const data = {
      formattedEvents: formattedEvents,
      rooms: rooms,
    };
    return data;
  } else {
    const data = {
      formattedEvents: null,
      rooms: rooms,
    };
    return data;
  }
}

async function CalendarPage() {
  const session = await requireAuthentication(authOptions);
  const data = await getData(session.user.id as string);

  return (
    <CalendarView userEvents={data.formattedEvents} roomOptions={data.rooms} />
  );
}

export default CalendarPage;
