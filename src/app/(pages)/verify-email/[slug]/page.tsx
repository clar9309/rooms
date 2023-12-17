import { TokenInterface } from "@/app/_models/token";
import VerifyEmail from "@/app/_views/VerifyEmail";
import { db } from "@/lib/prisma-client";
import jwt from "jsonwebtoken";

async function verifyToken(slug: string) {
  try {
    const decoded = jwt.verify(slug, "secret") as TokenInterface;

    if (!decoded.userEmail) {
      throw new Error("An error occurred");
    }

    const user = await db.user.findUnique({
      where: { email: decoded.userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user!.email_verified_at) {
      throw new Error("User already verified");
    }

    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();

    const updatedUser = await db.user.update({
      where: {
        id: user!.id,
      },
      data: {
        email_verified_at: isoDateString,
      },
    });

    if (!updatedUser) {
      throw new Error("User could not be updated");
    }
    console.log("User updated", updatedUser);
    return { msg: "You email was verified!", error: false };
  } catch (error) {
    console.log("error", error);
    return { msg: "Email verification failed :(", error: true };
  }
}

async function VerifyEmailPage({ params }: { params: { slug: string } }) {
  const result = await verifyToken(params.slug);
  return <VerifyEmail result={result} />;
}
export default VerifyEmailPage;
