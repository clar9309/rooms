import { db } from "@/lib/prisma-client";
import { hash } from "bcrypt";
import * as z from "zod";
import createuserschema from "../../../_utils/validation/schemas/user-signup-schema";
import { UserCreateInput } from "@/lib/prisma-types";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/app/_utils/email/sendEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { first_name, last_name, email, password, birthday } =
      //passing body through zod validation schema
      createuserschema.parse(body);

    //email unique                   //prisma
    const emailAlreadyExists = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (emailAlreadyExists) {
      return NextResponse.json(
        {
          user: null,
          msg: "This email is already in use",
        },
        //409 is used when a request conflicts with the current state of server
        { status: 409 }
      );
    }

    //HASHING PW
    const hashedPassword = await hash(password, 10);

    const statusId = await db.status.findUnique({
      where: {
        title: "Available",
      },
      select: {
        id: true,
      },
    });
    if (!statusId) {
      return NextResponse.json(
        {
          msg: "Internal server error",
        },
        { status: 500 }
      );
    }
    //NEW USER
    const newUser = await db.user.create({
      data: {
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: hashedPassword,
        birthday,
        status: { connect: { id: statusId.id } },
      },
    } as UserCreateInput);

    //EMAIL
    const token = jwt.sign(
      {
        userEmail: newUser.email,
      },
      "secret",
      { expiresIn: "1h" }
    );
    let root;
    if (process.env.NODE_ENV === "development") {
      root = "http://localhost:3000/";
    } else {
      root = "https://fullstack-rooms.vercel.app/";
    }

    const link = root + "verify-email/" + token;
    const emailData = {
      to: newUser.email,
      subject: "Rooms Fullstack project",
      html: `<html>
        <body>
        <div>
      <h2>Welcome!</h2>
      <p>
        Thank you for signing up to our exam project! You can verify your account
        by clicking on the link below.
      </p>
      <a href="${link}" target="_blank">Verify account</a>
    </div>
  </body>
</html>`,
    };

    //send email
    const res = await sendEmail(emailData);

    if (res.status !== 200) {
      return NextResponse.json(
        {
          msg: "Internal server error, email not sent",
        },
        { status: 500 }
      );
    }

    //SUCCESS
    return NextResponse.json(
      {
        user: newUser.first_name + " " + newUser.last_name,
        msg: "Succesfully created new user",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      //Zod errors
      const validationErrors = error.errors.map((err) => {
        return {
          message: err.message,
        };
      });
      // Return a validation error response
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    } else {
      //Other errors
      console.error(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
