import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma-client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function authenticateUser(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  let token;
  token = await getToken({ req: req, secret: secret, raw: true });

  if (process.env.NODE_ENV == "development") {
    token = await getToken({ req: req, secret: secret, raw: true });
  } else {
    const decoded = await getToken({ req: req, secret: secret });
    token = decoded?.sub;
  }

  //Validate token
  if (!token) {
    return {
      data: {
        msg: "Unauthorized - Invalid token",
      },
      status: 401,
    };
  }

  //Validate server-side session
  const session = await getServerSession(authOptions);

  if (!session || (session.user.id as string) !== token) {
    return {
      data: {
        msg: "Forbidden - Session mismatch",
      },
      status: 403,
    };
  }

  //Get user
  const user = await db.user.findUnique({
    where: {
      id: session.user.id as string,
    },
    include: {
      avatar: true,
    },
  });

  if (!user) {
    return {
      data: {
        msg: "User not found",
      },
      status: 404,
    };
  }

  return { data: { msg: "ok", user }, status: 200 };
}
