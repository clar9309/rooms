import { requireAuthentication } from "@/app/_middleware/authentication";
import { FormattedCalenderEvent } from "@/app/_models/event";
import EventsView from "@/app/_views/Events";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma-client";
import { redirect } from "next/navigation";

async function getData(id: string, slug: string) {
  if (!slug) {
    redirect("/error");
  }

  const room = await db.room.findUnique({
    where: {
      id: slug,
      participants: {
        some: {
          user_id: id,
        },
      },
    },
    include: {
      events: {
        include: {
          attendees: true,
        },
      },
    },
  });
  const roomOptions = await db.room.findMany({
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

  if (room?.events && room?.events.length !== 0) {
    const formattedEvents: FormattedCalenderEvent[] = room?.events.map(
      (event) => {
        const formattedEvent: FormattedCalenderEvent = {
          id: event.id,
          url: `/rooms/${event.room_id}/events/${event.id}`,
          start: event.start_time,
          title: event.title,
          allDay: event.all_day,
        };

        if (event.end_time) {
          formattedEvent.end = event.end_time;
        }

        return formattedEvent;
      }
    );

    const data = {
      formattedEvents: formattedEvents,
      roomTitle: room.title,
      roomOptions,
    };
    return data;
  } else {
    const data = {
      formattedEvents: null,
      roomTitle: room?.title,
      roomOptions,
    };
    return data;
  }
}

async function EventPage({ params }: { params: { slug: string } }) {
  const session = await requireAuthentication(authOptions);
  const data = await getData(session.user.id as string, params.slug);

  return (
    <EventsView
      roomEvents={data.formattedEvents}
      roomId={params.slug}
      roomTitle={data.roomTitle}
      roomOptions={data.roomOptions}
    />
  );
}

export default EventPage;
