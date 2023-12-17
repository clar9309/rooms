import { Notification } from "@prisma/client";

export interface FetchNotification extends Notification {
  meta_user: {
    first_name: string;
    last_name: string;
  };
}
