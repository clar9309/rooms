import { authenticateUser } from "@/app/_utils/authentication/authenticateUser";
import { email } from "@/app/_utils/validation/validations/email-validation";
import { db } from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    //Validate user
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

    //Validate body
    const body = await req.json();
    const val = email.safeParse(body.email);

    if (!val.success) {
      return NextResponse.json(
        {
          error: val.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    if (user!.email === body.email) {
      return NextResponse.json(
        {
          error: "User will automatically be added to room",
        },
        { status: 400 }
      );
    }

    const addedUser = await db.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        email: true,
      },
    });

    if (!addedUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        userEmail: addedUser.email,
        msg: "User found",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
