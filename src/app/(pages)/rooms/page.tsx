import { requireAuthentication } from "@/app/_middleware/authentication";
import Rooms from "@/app/_views/Rooms";
import { authOptions } from "@/lib/auth";

export default async function RoomsPage() {
  const session = await requireAuthentication(authOptions);

  return <Rooms sessionUser={session.user} />;
}
