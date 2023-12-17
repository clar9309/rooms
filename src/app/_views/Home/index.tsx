import { authOptions } from "@/lib/auth";
import DefaultHome from "./DefaultHome";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/rooms");
  }

  return !session && <DefaultHome />;
}
export default Home;
