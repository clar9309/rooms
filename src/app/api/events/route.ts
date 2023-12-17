import { UserId } from "@/app/_models/user";
import { notifyUsers } from "@/app/_utils/apis/notification";
import { authenticateUser } from "@/app/_utils/authentication/authenticateUser";
import createeventschema from "@/app/_utils/validation/schemas/event-create-schema";
import { reply } from "@/app/_utils/validation/validations/reply-validation";
import { db } from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    //validate user
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

    const roomId = req.nextUrl.searchParams.get("roomId");
    const activeDate = req.nextUrl.searchParams.get("date");

    if (!roomId || !activeDate) {
      return NextResponse.json({
        msg: "Required params not valid",
        status: 400,
      });
    }

    //find room events and ensure that the user is in this room
    const room = await db.room.findUnique({
      where: {
        id: roomId,
        participants: {
          some: {
            user_id: user!.id,
          },
        },
      },
      include: {
        events: {
          include: {
            attendees: true,
          },
        },
      },
    });
    if (!room) {
      return NextResponse.json({
        msg: "Room not found",
        status: 404,
      });
    }

    const filteredEvents = room.events.filter((event) => {
      const eventDate = new Date(event.start_time);
      const formattedEventDate = eventDate.toISOString().split("T")[0]; // Extracting YYYY-MM-DD from the date

      return formattedEventDate === activeDate;
    });

    return NextResponse.json(
      {
        msg: "Ok",
        filteredEvents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    //validate user
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
    const {
      title,
      roomId,
      description,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
      allDay,
    } = createeventschema.parse(body);

    //Find room
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

    //Validate room
    if (!room) {
      return NextResponse.json(
        {
          error: "Room not found",
        },
        { status: 404 }
      );
    }

    //Event data
    const updates: { [key: string]: any } = {};

    //Convert start date
    const newStartDate = new Date(startDate);
    const newStartTime = startTime.split(":");
    newStartDate.setHours(
      parseInt(newStartTime[0], 10),
      parseInt(newStartTime[1], 10)
    );

    const formattedDateTime = newStartDate.toISOString();
    const start_time = formattedDateTime;

    if (!allDay) {
      const newEndDate = new Date(endDate);
      const newEndTime = endTime.split(":");
      newEndDate.setHours(
        parseInt(newEndTime[0], 10),
        parseInt(newEndTime[1], 10)
      );
      const formattedDateTime = newEndDate.toISOString();
      updates.end_time = formattedDateTime;
    }

    //Create event

    const result = await db.$transaction(async (db) => {
      // Create the event
      const newEvent = await db.event.create({
        data: {
          title: title,
          start_time: start_time,
          end_time: updates.end_time && updates.end_time,
          all_day: allDay,
          location: location && location,
          description: description && description,
          admin: { connect: { id: user!.id } },
          room: { connect: { id: room.id } },
        },
      });

      //Create event attendees for each participant in the room
      const attendeePromises = room.participants.map(async (participant) => {
        const newEventAttendee = await db.eventAttendee.create({
          data: {
            user: { connect: { id: participant.user.id } },
            event: { connect: { id: newEvent.id } },
            reply: participant.user.id !== user!.id ? "pending" : "accepted",
          },
          select: {
            user_id: true,
          },
        });

        return newEventAttendee;
      });

      const newEventAttendees = await Promise.all(attendeePromises);

      return { newEvent, newEventAttendees };
    });

    //Create notifications
    if (result.newEventAttendees.length !== 0) {
      try {
        const updatedAttendees = result.newEventAttendees.filter(
          (a) => a.user_id !== user!.id
        );

        const notifications = await Promise.all(
          updatedAttendees.map(async (a) => {
            try {
              if (a.user_id !== user!.id) {
                const notification = await db.notification.create({
                  data: {
                    read: false,
                    user: { connect: { id: a.user_id } },
                    meta_user: { connect: { id: user!.id } },
                    meta_action: "invited",
                    meta_target: "event",
                    meta_target_name: result.newEvent.title,
                    meta_link: `/rooms/${room.id}/events/${result.newEvent.id}`,
                  },
                  select: {
                    user_id: true,
                  },
                });
                return notification;
              }
            } catch (error) {
              console.error(
                `Error occurred while creating notification for ${a}:`,
                error
              );
              return null;
            }
          })
        );

        //Send out notifications
        const notificationResult = await notifyUsers(
          notifications as UserId[],
          {
            msg: "New event created!",
          }
        );

        if (!notificationResult.success) {
          console.error("Error: Pusher notification trigger in create event");
        }
      } catch (error) {
        console.error(
          "Error occurred while creating notifications in create event"
        );
      }
    }

    return NextResponse.json(
      {
        msg: "Ok",
        newEvent: result.newEvent,
      },
      { status: 200 }
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

export async function PUT(req: NextRequest) {
  try {
    //validate user
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
    const result = reply.safeParse(body.reply);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Reply does not have accepted value",
        },
        { status: 400 }
      );
    }
    if (!body.eventId) {
      return NextResponse.json(
        {
          error: "eventId is required",
        },
        { status: 400 }
      );
    }

    const event = await db.event.findUnique({
      where: {
        id: body.eventId,
      },
      select: {
        admin_fk: true,
        title: true,
        room_id: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        {
          error: "Event not found",
        },
        { status: 404 }
      );
    }

    const updatedAttendee = await db.eventAttendee.update({
      where: {
        user_id_event_id: {
          user_id: user!.id,
          event_id: body.eventId,
        },
      },
      data: {
        reply: result.data,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    //when attendee updates reply send notification to admin
    try {
      const notification = await db.notification.create({
        data: {
          read: false,
          user: { connect: { id: event.admin_fk } },
          meta_user: { connect: { id: user!.id } },
          meta_action: "updated",
          meta_target: "event reply",
          meta_target_name: event.title,
          meta_link: `/rooms/${event.room_id}/events/${body.eventId}`,
        },
        select: {
          user_id: true,
        },
      });
      const notificationArray = [];
      notificationArray.push(notification);

      //Send out notifications
      const notificationResult = await notifyUsers(
        notificationArray as UserId[],
        {
          msg: "Someone replied to your event!",
        }
      );

      if (!notificationResult.success) {
        console.error("Error: Pusher notification trigger in create event");
      }
    } catch (error) {
      console.error(
        "Error occurred while creating notifications in update event reply"
      );
    }

    return NextResponse.json(
      {
        msg: "Ok",
        updatedAttendee: updatedAttendee,
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

    if (!body.eventId) {
      return NextResponse.json(
        {
          error: "eventId is required",
        },
        { status: 400 }
      );
    }

    //find event
    const event = await db.event.findUnique({
      where: {
        id: body.eventId,
      },
      include: {
        attendees: {
          where: {
            user_id: {
              not: user!.id,
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        {
          error: "Event not found",
        },
        { status: 404 }
      );
    }

    //validate that the user is admin on that event
    if (event.admin_fk !== user!.id) {
      return NextResponse.json(
        {
          error: "Not authorized to perform this action",
        },
        { status: 403 }
      );
    }
    //delete event
    await db.event.delete({
      where: {
        id: event.id,
      },
    });

    //notifcations
    if (event.attendees.length !== 0) {
      try {
        const notifications = await Promise.all(
          event.attendees.map(async (a) => {
            try {
              const notification = await db.notification.create({
                data: {
                  read: false,
                  user: { connect: { id: a.user_id } },
                  meta_user: { connect: { id: user!.id } },
                  meta_action: "deleted",
                  meta_target: "event",
                  meta_target_name: event.title,
                },
                select: {
                  user_id: true,
                },
              });
              return notification;
            } catch (error) {
              console.error(
                `Error occurred while creating notification for ${a}:`,
                error
              );
              return null;
            }
          })
        );

        const notificationResult = await notifyUsers(
          notifications as UserId[],
          {
            msg: "New room created!",
          }
        );

        if (!notificationResult.success) {
          console.error("Error: Pusher notification trigger in create room");
        }
      } catch (error) {
        console.error(
          "Error occurred while creating notifications in create room"
        );
      }
    }

    return NextResponse.json(
      {
        msg: "Event succesfully deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
  }
}
