import { UserId } from "@/app/_models/user";
import { notifyUsers } from "@/app/_utils/apis/notification";
import { authenticateUser } from "@/app/_utils/authentication/authenticateUser";
import { participantcreateschema } from "@/app/_utils/validation/schemas/participant-create-schema";
import participantdeleteschema from "@/app/_utils/validation/schemas/participant-delete-schema";
import { maxParticipants } from "@/app/_utils/validation/validationVariables";
import { db } from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
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
    const { roomId, emails } = participantcreateschema.parse(body);

    const room = await db.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          error: "Room not found",
        },
        { status: 404 }
      );
    }

    //Validate user is admin
    if (user!.id !== room.admin_fk) {
      return NextResponse.json(
        {
          error: "Access to edit room forbidden",
        },
        { status: 403 }
      );
    }

    //Validate max participants
    const currentParticipants = room.participants.length;
    if (currentParticipants + emails.length > maxParticipants) {
      return NextResponse.json(
        {
          error: `Maximum number of participants is ${maxParticipants}`,
        },
        { status: 400 }
      );
    }
    const participants = [];

    const errors = [];
    for (const email of emails) {
      const existingUser = await db.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!existingUser) {
        errors.push({ error: "Users not found", status: 404 });
      }
      if (errors.length > 0) {
        return NextResponse.json(errors[0], { status: errors[0].status });
      } else {
        participants.push({
          is_favourited: false,
          user_id: existingUser!.id,
          room_id: room.id,
        });
      }
    }

    //Create participants
    const newParticipants = await db.$transaction(
      participants.map((p) =>
        db.participant.create({ data: p, include: { user: true } })
      )
    );

    //Create notifications
    try {
      const notifications = await Promise.all(
        newParticipants.map(async (p) => {
          try {
            const notification = await db.notification.create({
              data: {
                read: false,
                user: { connect: { id: p.user_id } },
                meta_user: { connect: { id: user!.id } },
                meta_action: "invited",
                meta_target: "room",
                meta_target_name: room.title,
                meta_link: `/rooms/${room.id}`,
              },
              select: {
                user_id: true,
              },
            });
            return notification;
          } catch (error) {
            console.error(
              `Error occurred while creating notification for ${p}:`,
              error
            );
            return null;
          }
        })
      );

      const notificationResult = await notifyUsers(notifications as UserId[], {
        msg: "Added to room!",
      });

      if (!notificationResult.success) {
        console.error("Error: Pusher notification trigger in invite to room");
      }
    } catch (error) {
      console.error(
        "Error occurred while creating notifications in create participants"
      );
    }

    return NextResponse.json(
      {
        msg: "Ok",
        newParticipants: newParticipants,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
  }
}

export async function DELETE(req: NextRequest) {
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
    const { roomId, userId } = participantdeleteschema.parse(body);

    const room = await db.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          error: "Room not found",
        },
        { status: 404 }
      );
    }

    //Validate user is admin
    if (user!.id !== room.admin_fk) {
      return NextResponse.json(
        {
          error: "Access to edit room forbidden",
        },
        { status: 403 }
      );
    }

    //validate that user cant delete themselves
    if (userId === user!.id) {
      return NextResponse.json(
        {
          error: "Admin cannot be deleted",
        },
        { status: 400 }
      );
    }

    const existingParticipant = await db.participant.findFirst({
      where: {
        user_id: userId,
        room_id: roomId,
      },
      select: {
        id: true,
      },
    });
    if (!existingParticipant) {
      return NextResponse.json(
        {
          error: "Could not find participant",
        },
        { status: 404 }
      );
    }

    //delete participant
    const deletedParticipant = await db.participant.delete({
      where: {
        id: existingParticipant.id,
      },
    });
    try {
      const notification = await db.notification.create({
        data: {
          read: false,
          user: { connect: { id: deletedParticipant.user_id } },
          meta_user: { connect: { id: user!.id } },
          meta_action: "removed",
          meta_target: "room",
          meta_target_name: room.title,
        },
        select: {
          user_id: true,
        },
      });
      const notificationArray = [];
      notificationArray.push(notification);
      const notificationResult = await notifyUsers(
        notificationArray as UserId[],
        {
          msg: "Removed from room!",
        }
      );

      if (!notificationResult.success) {
        console.error("Error: Pusher notification trigger in delete from room");
      }
    } catch (error) {
      console.error(
        "Error occurred while creating notifications in delete participants"
      );
    }
    return NextResponse.json(
      {
        msg: "Ok",
        user: deletedParticipant,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
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
