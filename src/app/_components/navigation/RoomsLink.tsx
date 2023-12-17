"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function RoomsLink() {
  const pathname = usePathname();
  return (
    <li>
      <Link
        href="/rooms"
        className={`flex p-3 rounded-full border hover:border-grey transition duration-200 ease-in-out ${
          pathname.includes("rooms") ? "border-grey" : "border-primary"
        }`}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27.9237 12.9463H18.6929C18.0557 12.9463 17.5391 13.4629 17.5391 14.1001V27.9463C17.5391 28.5835 18.0557 29.1001 18.6929 29.1001H27.9237C28.5609 29.1001 29.0775 28.5835 29.0775 27.9463V14.1001C29.0775 13.4629 28.5609 12.9463 27.9237 12.9463Z"
            fill="#9A9A9A"
            stroke="#9A9A9A"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27.9237 1H18.6929C18.0557 1 17.5391 1.51659 17.5391 2.15385V6.79231C17.5391 7.42956 18.0557 7.94615 18.6929 7.94615H27.9237C28.5609 7.94615 29.0775 7.42956 29.0775 6.79231V2.15385C29.0775 1.51659 28.5609 1 27.9237 1Z"
            fill="#9A9A9A"
            stroke="#9A9A9A"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.3846 1H2.15385C1.51659 1 1 1.51659 1 2.15385V16C1 16.6372 1.51659 17.1538 2.15385 17.1538H11.3846C12.0219 17.1538 12.5385 16.6372 12.5385 16V2.15385C12.5385 1.51659 12.0219 1 11.3846 1Z"
            fill="#9A9A9A"
            stroke="#9A9A9A"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.3846 22.1543H2.15385C1.51659 22.1543 1 22.6709 1 23.3081V27.9466C1 28.5839 1.51659 29.1005 2.15385 29.1005H11.3846C12.0219 29.1005 12.5385 28.5839 12.5385 27.9466V23.3081C12.5385 22.6709 12.0219 22.1543 11.3846 22.1543Z"
            fill="#9A9A9A"
            stroke="#9A9A9A"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </li>
  );
}

export default RoomsLink;
