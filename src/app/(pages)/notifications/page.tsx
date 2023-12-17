import { requireAuthentication } from "@/app/_middleware/authentication";
import Notification from "@/app/_views/Notification";
import { authOptions } from "@/lib/auth";

async function NotificationPage() {
  const session = await requireAuthentication(authOptions);

  return <Notification />;
}

export default NotificationPage;
