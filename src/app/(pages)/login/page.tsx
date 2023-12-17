import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Login from "@/app/_views/Login";
import { redirect } from "next/navigation";

async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/");
  }

  return <Login />;
}

export default LoginPage;
