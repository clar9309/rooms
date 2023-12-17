import Image from "next/image";
import Link from "next/link";

function DefaultHome() {
  return (
    <main className="pt-16 lg:h-screen lg:grid lg:items-center">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[6.25rem] max-h-[28rem] min-w-[5.5rem] lg:min-h-[28rem] lg:min-w-[28rem]">
          <Image
            src={"/logo.svg"}
            fill={true}
            alt={"Logo"}
            style={{ objectFit: "contain" }}
          />
        </div>

        <div className="mt-10 lg:mt-0 grid items-center justify-center">
          <div>
            <h1 className="text-h2 lg:text-h1 font-medium">
              Share and organize your daily life with Rooms
            </h1>
            <div className="flex gap-7 justify-center lg:justify-start items-center mt-16 flex-wrap">
              <Link
                href="/signup"
                className="primary-btn text-2xl font-medium w-full max-w-xs hover:bg-opacity-0 hover:text-white"
              >
                Create an account
              </Link>
              <Link
                href="/login"
                className="secondary-btn text-2xl font-medium w-full max-w-xs hover:bg-white hover:text-bg_black"
              >
                Go to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DefaultHome;
