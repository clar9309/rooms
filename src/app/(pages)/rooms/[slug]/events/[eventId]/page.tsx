import { requireAuthentication } from "@/app/_middleware/authentication";
import EventView from "@/app/_views/Event";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma-client";
import { redirect } from "next/navigation";

async function getData(
  userId: string,
  params: { slug: string; eventId: string }
) {
  if (!params.slug || !params.eventId) {
    redirect("/error");
  } else {
    const room = await db.room.findUnique({
      where: {
        id: params.slug,
        participants: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        events: {
          where: {
            id: params.eventId,
          },
          include: {
            attendees: {
              include: {
                user: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!room || room.events.length === 0) {
      redirect("/error");
    }

    //Check if user has access to this
    const isUserinAttendees = room.events[0].attendees.some(
      (item) => item.user_id === userId
    );
    if (!isUserinAttendees) {
      redirect("/error");
    }

    const data = {
      room: { id: room.id, title: room.title },
      event: room.events[0],
    };
    return data;
  }
}

interface EventPageProps {
  params: { slug: string; eventId: string };
}

async function EventPage({ params }: EventPageProps) {
  const session = await requireAuthentication(authOptions);
  const data = await getData(session.user.id as string, params);
  return <EventView roomData={data.room} eventData={data.event} />;
}

export default EventPage;
