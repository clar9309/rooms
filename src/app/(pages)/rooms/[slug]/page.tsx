import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RoomView from "@/app/_views/Room";
import { Location, Participant } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getCalendarDays } from "@/app/_utils/helpers/date";

async function getWeatherData(location?: Location) {
  if (!location) {
    return null;
  } else if (location) {
    const { latitude, longitude } = location;

    const resp = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_APP_ID}&units=metric&cnt=6`,
      {
        method: "GET",
      }
    );
    if (resp.ok) {
      const data = await resp.json();
      return data.list;
    } else {
      console.log("Error fetching weather");
      return null;
    }
  }
}

async function updateVisitedAt(participant: Participant) {
  try {
    await db.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        visited_at: new Date().toISOString(),
      },
    });

    revalidatePath("/rooms");
  } catch (error) {
    console.error("Error updating visited_at:", error);
  }
}

async function getData(params: { slug: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  if (!params.slug) {
    redirect("/error");
  } else {
    const room = await db.room.findUnique({
      where: {
        id: params.slug as string,
        participants: {
          some: {
            user_id: session.user.id as string,
          },
        },
      },
      include: {
        cover: true,
        location: true,
        participants: {
          include: {
            user: {
              include: {
                avatar: true,
                status: true,
              },
            },
          },
        },
        note_widget: {
          include: {
            note_item: true,
          },
        },
      },
    });

    if (!room) {
      redirect("/error");
    }

    const taskWidget = await db.taskWidget.findUnique({
      where: {
        room_fk: room.id,
      },
      include: {
        task_item: {
          orderBy: {
            order: "asc", // replace 'order' with the actual field you want to use for sorting
          },
        },
      },
    });

    const participant = await db.participant.findFirst({
      where: {
        room_id: params.slug as string,
        user_id: session.user.id as string,
      },
    });

    if (participant) {
      await updateVisitedAt(participant);
    }

    const weatherData = await getWeatherData(room.location!);

    const calendarDayData = await getCalendarDays();

    const data = {
      room,
      taskWidget,
      note: room.note_widget?.note_item[0],
      weatherData,
      calendarDayData,
    };

    return data;
  }
}

interface RoomPageProps {
  searchParams: { modal: string } | undefined | null;
  params: { slug: string };
}

async function RoomPage({ params, searchParams }: RoomPageProps) {
  const data = await getData(params);

  return (
    data && (
      <RoomView
        room={data.room}
        modalParams={searchParams}
        taskWidget={data.taskWidget}
        noteItem={data?.note}
        weatherData={data.weatherData}
        calendarDayData={data.calendarDayData}
      />
    )
  );
}

export default RoomPage;
