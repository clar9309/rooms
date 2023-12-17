import { requireAuthentication } from "@/app/_middleware/authentication";
import ProfileView from "@/app/_views/Profile";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma-client";
import { redirect } from "next/navigation";

async function getData(id: string) {
  try {
    const profile = await db.user.findUnique({
      where: {
        id: id,
      },
      select: {
        first_name: true,
        last_name: true,
        birthday: true,
        status: true,
        id: true,
        avatar: true,
      },
    });
    if (!profile) {
      redirect("/error");
    }

    const status = await db.status.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    const cleanProfile = {
      ...profile,
      status: profile.status.id,
    };

    const data = {
      cleanProfile,
      status,
    };
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    redirect("/error");
  }
}

async function ProfilePage() {
  const session = await requireAuthentication(authOptions);

  const data = await getData(session.user.id as string);
  return (
    data && (
      <ProfileView profile={data?.cleanProfile} statusOptions={data.status} />
    )
  );
}

export default ProfilePage;
