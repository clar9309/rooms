"use client";
import Image from "next/image";
import getStatusColor from "@/app/_utils/helpers/getStatus";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function ProfileLink() {
  const { data: session } = useSession();
  const [statusColor, setStatusColor] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (session?.user.status) {
      setStatusColor(getStatusColor(session.user.status as string));
    }
  }, [session?.user.status]);

  return (
    <li className="relative md:mt-auto md:mb-7">
      {session && (
        <>
          <Link
            href={`/profile`}
            className={`relative flex rounded-full border overflow-hidden hover:border-grey transition duration-200 ease-in-out ${
              pathname.includes("profile") ? "border-grey" : "border-primary"
            }`}
          >
            <div className="relative min-w-[3rem] h-full min-h-[3rem] overflow-hidden">
              <Image
                src={
                  session.user.image
                    ? session.user.image
                    : "/default_avatar.png"
                }
                alt={"avatar picture"}
                style={{ objectFit: "cover" }}
                fill={true}
                sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
                className="filter group-hover:brightness-90 transition"
              />
            </div>
          </Link>
          <div
            className={`absolute bottom-0.5 right-0.5 z-10 rounded-full w-3 h-3  
                    ${statusColor}`}
          ></div>
        </>
      )}
    </li>
  );
}

export default ProfileLink;
