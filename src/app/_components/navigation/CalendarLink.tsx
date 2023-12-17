"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function CalendarLink() {
  const pathname = usePathname();

  return (
    <li>
      <Link
        href="/calendar"
        className={`flex p-3 rounded-full border hover:border-grey transition duration-200 ease-in-out px-[0.88rem] ${
          pathname.includes("calendar") ? "border-grey" : "border-primary"
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
            d="M2.62437 30C1.87687 30 1.25287 29.7466 0.752375 29.2397C0.250791 28.7318 0 28.0993 0 27.3423V6.32748C0 5.57049 0.250791 4.93856 0.752375 4.43171C1.25287 3.92375 1.87687 3.66978 2.62437 3.66978H5.50063V0H7.25075V3.66978H18.8744V0H20.4994V3.66978H23.3756C24.1231 3.66978 24.7471 3.92375 25.2476 4.43171C25.7492 4.93856 26 5.57049 26 6.32748V27.3423C26 28.0993 25.7498 28.7312 25.2493 29.2381C24.7477 29.746 24.1231 30 23.3756 30H2.62437ZM2.62437 28.3544H23.3756C23.6248 28.3544 23.8539 28.249 24.063 28.0384C24.271 27.8267 24.375 27.5946 24.375 27.3423V12.91H1.625V27.3423C1.625 27.5946 1.729 27.8267 1.937 28.0384C2.14608 28.249 2.37521 28.3544 2.62437 28.3544ZM1.625 11.2644H24.375V6.32748C24.375 6.07515 24.271 5.84312 24.063 5.63138C23.8539 5.42073 23.6248 5.31541 23.3756 5.31541H2.62437C2.37521 5.31541 2.14608 5.42073 1.937 5.63138C1.729 5.84312 1.625 6.07515 1.625 6.32748V11.2644Z"
            fill="#9A9A9A"
          />
        </svg>
      </Link>
    </li>
  );
}

export default CalendarLink;
