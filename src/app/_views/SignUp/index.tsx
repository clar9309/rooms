import SignUpForm from "@/app/_components/forms/SignUpForm";
import Image from "next/image";
import Link from "next/link";

function SignUp() {
  return (
    <main className="grid justify-center my-20">
      <Link href="/" className="flex justify-center justify-self-center">
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
        <h1 className="text-h2 md:text-h1 text-center">Create your account</h1>
        <div className="grid grid-cols-3 items-center gap-6 py-10">
          <span className="h-[1px] bg-darkGrey"></span>
          <p className="text-darkGrey text-xs text-h3 italic">
            fill out the fields below
          </p>
          <span className="h-[1px] bg-darkGrey"></span>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}

export default SignUp;
