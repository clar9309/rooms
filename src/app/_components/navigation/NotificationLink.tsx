"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "react-query";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function useNotifications() {
  const { data: session } = useSession();
  const userId = session?.user.id as string;
  const pathname = usePathname();

  return useQuery(["notifications", userId], async () => {
    if (!session) {
      return null;
    }

    const resp = await fetch(`/api/notifications/unread?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session!.token.sub}`,
      },
    });
    if (resp.ok) {
      const data = await resp.json();
      return data.unreadNotifications;
    } else {
      return null;
    }
  });
}

function NotificationLink() {
  const { data: session } = useSession();
  const { data, isLoading } = useNotifications();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  useEffect(() => {
    if (session) {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
        cluster: "eu",
      });

      const channel = pusher.subscribe(`user_${session.user.id}`);
      channel.bind("notification", (data: any) => {
        // console.log("Received notification:", data);
        if (data) {
          queryClient.invalidateQueries([
            "notifications",
            session!.user.id as string,
          ]);
        }
      });

      return () => {
        //Unsubscribe from Pusher channel when component unmounts
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [session]);

  return (
    <li className="relative">
      <Link
        href="/notifications"
        className={`py-3 px-[0.88rem] rounded-full border w-full flex justify-center items-center hover:border-grey transition duration-200 ease-in-out ${
          pathname.includes("notifications") ? "border-grey" : "border-primary"
        }`}
      >
        <svg
          width="26"
          height="30"
          viewBox="0 0 26 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.7619 23.7273H23.8333V12.1364C23.8333 7.32614 19.7979 3.35114 14.5476 2.68977V1.36364C14.5476 0.610227 13.8551 0 13 0C12.1449 0 11.4524 0.610227 11.4524 1.36364V2.68977C6.20208 3.35114 2.16667 7.32614 2.16667 12.1364V23.7273H1.2381C0.553274 23.7273 0 24.2148 0 24.8182V25.9091C0 26.0591 0.139286 26.1818 0.309524 26.1818H8.66667C8.66667 28.2886 10.6089 30 13 30C15.3911 30 17.3333 28.2886 17.3333 26.1818H25.6905C25.8607 26.1818 26 26.0591 26 25.9091V24.8182C26 24.2148 25.4467 23.7273 24.7619 23.7273ZM13 27.8182C11.9747 27.8182 11.1429 27.0852 11.1429 26.1818H14.8571C14.8571 27.0852 14.0253 27.8182 13 27.8182ZM4.95238 23.7273V12.1364C4.95238 10.2409 5.7881 8.46136 7.30863 7.12159C8.82917 5.78182 10.8488 5.04545 13 5.04545C15.1512 5.04545 17.1708 5.78182 18.6914 7.12159C20.2119 8.46136 21.0476 10.2409 21.0476 12.1364V23.7273H4.95238Z"
            fill="#9A9A9A"
          />
        </svg>
      </Link>
      {!isLoading && data !== null && data !== 0 && (
        <span className="text-white absolute -top-1 -right-1 bg-warning h-[1.25rem] w-[1.25rem] text-[0.5rem] font-medium rounded-full flex items-center justify-center">
          {data}
        </span>
      )}
    </li>
  );
}

export default NotificationLink;
