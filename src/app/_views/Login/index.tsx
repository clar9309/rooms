import LoginForm from "@/app/_components/forms/LoginForm";
import Image from "next/image";
import Link from "next/link";

function Login() {
  return (
    <main className="grid justify-center my-20">
      <Link
        href="/"
        className="flex justify-center justify-self-center"
        aria-label="Home"
      >
        <div className="relative min-h-[4rem] min-w-[3.5rem] md:min-h-[6.5rem] md:min-w-[5.25rem] flex items-center">
          <Image
            src={"/logo.svg"}
            fill={true}
            alt={"Logo"}
            style={{ objectFit: "contain" }}
          />
        </div>
      </Link>
      <div className="mt-14">
        <h1 className="text-h2 md:text-h1 text-center">
          Log into your account
        </h1>
        <div className="grid grid-cols-3 items-center gap-6 py-10">
          <span className="h-[1px] bg-darkGrey"></span>
          <p className="text-darkGrey text-xs text-h3 italic text-center">
            fill out the fields below
          </p>
          <span className="h-[1px] bg-darkGrey"></span>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

export default Login;
