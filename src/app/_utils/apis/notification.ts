import { UserId } from "@/app/_models/user";

export async function notifyUsers(
  userIds: UserId[],
  eventData: { msg: string }
) {
  const Pusher = require("pusher");
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "eu",
    useTLS: true,
  });

  const promises = userIds.map((user) => {
    pusher.trigger(`user_${user.user_id}`, "notification", eventData.msg);
  });

  try {
    const results = await Promise.all(promises);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
