import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma-client";

export async function requireAuthentication(authOptions: any, slug?: string) {
  const session = (await getServerSession(authOptions)) as Session;

  if (!session) {
    redirect("/");
  }
  //Check if user exists
  const user = await db.user.findUnique({
    where: {
      id: session.user.id as string,
    },
  });

  if (!user) {
    redirect("/error");
  }

  //if slug is passed then also authenticate access
  if (slug) {
    const roomExistsForUser = await db.participant.findFirst({
      where: {
        room_id: slug,
        user_id: user.id,
      },
    });

    if (!roomExistsForUser) {
      redirect("/error");
    }
  }

  return session;
}
