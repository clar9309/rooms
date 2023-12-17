import SignUp from "@/app/_views/SignUp";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/");
  }

  return <SignUp />;
}

export default SignupPage;
