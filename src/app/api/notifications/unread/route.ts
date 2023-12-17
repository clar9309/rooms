import { authenticateUser } from "@/app/_utils/authentication/authenticateUser";
import { db } from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const resp = await authenticateUser(req);

    if (resp.status !== 200) {
      const msg = resp.data.msg;

      return NextResponse.json(
        {
          error: msg,
        },
        { status: resp.status }
      );
    }

    const { user } = resp.data;
    const paramsUserId = req.nextUrl.searchParams.get("userId");

    if (user!.id !== paramsUserId) {
      return NextResponse.json(
        {
          error: "Forbidden - Session mismatch",
        },
        { status: 403 }
      );
    }

    const notifications = await db.notification.findMany({
      where: {
        user: {
          id: user!.id,
        },
        read: false,
      },
    });

    return NextResponse.json(
      {
        msg: "ok",
        unreadNotifications: notifications.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
