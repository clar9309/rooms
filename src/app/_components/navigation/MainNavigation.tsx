import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import ProfileLink from "./ProfileLink";
import NotificationLink from "./NotificationLink";
import RoomsLink from "./RoomsLink";
import CalendarLink from "./CalendarLink";

async function MainNavigation() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session?.user && (
        <>
          <Link href="/rooms" className="md:hidden pt-9 px-7 ">
            <svg
              className="w-10 h-auto"
              width="83"
              height="98"
              viewBox="0 0 83 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 98V0H17.1869V15.68L42.1987 0C54.4949 0 65.5337 3.64 71.8215 9.8C76.9916 15.12 79.9259 22.4 79.9259 30.94V31.22C79.9259 47.32 70.2845 56.98 56.5909 60.9L83 98H62.7391L38.7054 63.84H17.1869V98H0ZM17.1869 63.84H38.7054V48.58H42.3384C54.6347 48.58 62.4596 42.14 62.4596 32.2V31.92C62.4596 21.42 54.9141 15.68 42.1987 15.68V0L17.1869 15.68V63.84Z"
                fill="#3E3434"
              />
            </svg>
          </Link>

          <div className="h-full w-full md:auto md:h-screen bg-bg_black ">
            <nav className="fixed bottom-0 left-0 w-screen md:w-auto md:h-full z-20 bg-bg_black">
              <ul className="flex w-full justify-evenly items-center md:justify-start pb-3 pt-2 md:pt-7 md:w-auto md:flex-col md:items-start md:gap-6 md:px-9 md:h-full">
                <RoomsLink />
                <NotificationLink />
                <CalendarLink />
                <ProfileLink />
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

export default MainNavigation;
