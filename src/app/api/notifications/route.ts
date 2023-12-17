import { authenticateUser } from "@/app/_utils/authentication/authenticateUser";
import { db } from "@/lib/prisma-client";
import { Notification } from "@prisma/client";
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

    const pageSize = 5;

    const pageNumber = req.nextUrl.searchParams.get("pageNumber");
    if (!pageNumber) {
      return NextResponse.json({
        msg: "No page number in query params",
        status: 400,
      });
    }

    const notifications = await db.notification.findMany({
      where: {
        user: {
          id: user!.id,
        },
      },
      include: {
        meta_user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      take: pageSize, //Number of notif to fetch
      skip: (parseInt(pageNumber) - 1) * pageSize, //Calculate the offset based on page number
      orderBy: { created_at: "desc" },
    });

    const nextPage = parseInt(pageNumber) + 1;
    const nextPageResults = await db.notification.findMany({
      where: {
        user: {
          id: user!.id,
        },
      },
      include: {
        meta_user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      take: pageSize,
      skip: (nextPage - 1) * pageSize,
      orderBy: { created_at: "desc" },
    });

    let hasNextPage;

    if (nextPageResults.length === 0) {
      hasNextPage = false;
    } else {
      hasNextPage = true;
    }

    return NextResponse.json(
      {
        msg: "ok",
        notifications: notifications,
        hasNextPage: hasNextPage,
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

export async function PUT(req: NextRequest) {
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

    const body = await req.json();

    const notificationIdsToUpdate = body.unreadNotifications.map(
      (n: Notification) => n.id
    );

    await db.notification.updateMany({
      where: {
        id: { in: notificationIdsToUpdate },
        read: false,
        user_id: user!.id,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(
      {
        msg: "ok",
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
