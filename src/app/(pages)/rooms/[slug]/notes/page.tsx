import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma-client";
import Notes from "@/app/_views/Notes";

async function getData(params: { slug: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  if (!params.slug) {
    redirect("/error");
  }

  const room = await db.room.findUnique({
    where: {
      id: params.slug,
      participants: {
        some: {
          user_id: session.user.id as string,
        },
      },
    },
    include: {
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

  const data = {
    session,
    notes: room.note_widget?.note_item,
    noteWidgetId: room.note_widget?.id,
    roomTitle: room.title,
  };
  return data;
}

async function NotePage({ params }: { params: { slug: string } }) {
  const data = await getData(params);
  return (
    data && (
      <Notes
        roomId={params.slug}
        notes={data.notes}
        noteWidgetId={data.noteWidgetId!}
        roomTitle={data.roomTitle}
      />
    )
  );
}
export default NotePage;
