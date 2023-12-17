import { UserId } from "@/app/_models/user";
import { notifyUsers } from "@/app/_utils/apis/notification";
import { authenticateUser } from "@/app/_utils/authentication/authenticateUser";
import generateSignature from "@/app/_utils/helpers/cloudinary";
import editroomschema from "@/app/_utils/validation/schemas/backend/room-edit-schema";
import createroomschema from "@/app/_utils/validation/schemas/room-create-schema";
import { db } from "@/lib/prisma-client";
import { Room } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const Pusher = require("pusher");

    const resp = await authenticateUser(req);

    if (resp.status !== 200) {
      const msg = resp.data.msg;

      return NextResponse.json(
        {
          msg: msg,
        },
        { status: resp.status }
      );
    }
    const { user } = resp.data;

    if (!user) {
      return NextResponse.json({ msg: "User not found", status: 404 });
    }

    //fetch rooms
    const rooms = await db.room.findMany({
      where: {
        participants: {
          some: {
            user_id: user.id as string,
          },
        },
      },
      include: {
        location: true,
        cover: true,
        participants: {
          select: {
            visited_at: true,
            user_id: true,
          },
        },
      },
    });
    //sort rooms
    const sortedRooms = rooms.slice().sort((a, b) => {
      const participantA = a.participants.find(
        (participant) => participant.user_id === user.id
      );

      const participantB = b.participants.find(
        (participant) => participant.user_id === user.id
      );

      const visitedAtA = participantA?.visited_at
        ? new Date(participantA.visited_at)
        : null;
      const visitedAtB = participantB?.visited_at
        ? new Date(participantB.visited_at)
        : null;

      if (visitedAtA && visitedAtB) {
        return visitedAtB.getTime() - visitedAtA.getTime();
      } else if (visitedAtA) {
        return -1;
      } else if (visitedAtB) {
        return 1;
      } else {
        return 0;
      }
    });
    return NextResponse.json(
      {
        data: sortedRooms as Room[],
        msg: "Ok",
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
    const body = await req.json();
    const { title, emails } = createroomschema.parse(body);

    const participants = [
      {
        is_favourited: false,
        user_id: user!.id,
      },
    ];

    const errors = [];
    //Validate emails
    for (const email of emails) {
      const existingUser = await db.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!existingUser) {
        errors.push({ error: "Users not found", status: 404 });
      }

      if (email === user!.email) {
        errors.push({
          error: "Creator will already be added to room",
          status: 400,
        });
      }

      if (errors.length > 0) {
        return NextResponse.json(errors[0], { status: errors[0].status });
      } else {
        participants.push({
          is_favourited: false,
          user_id: existingUser!.id,
        });
      }
    }
    //Create room
    const newRoom = await db.room.create({
      data: {
        title: title,
        admin: { connect: { id: user!.id } },
        participants: {
          create: participants,
        },
        //Nested writes
        note_widget: {
          create: {},
        },
        task_widget: {
          create: {},
        },
      },
      include: {
        participants: {
          where: {
            user_id: {
              not: user!.id,
            },
          },
        },
      },
    });
    if (newRoom.participants.length !== 0) {
      try {
        const notifications = await Promise.all(
          newRoom.participants.map(async (p) => {
            try {
              const notification = await db.notification.create({
                data: {
                  read: false,
                  user: { connect: { id: p.user_id } },
                  meta_user: { connect: { id: user!.id } },
                  meta_action: "created",
                  meta_target: "room",
                  meta_target_name: newRoom.title,
                  meta_link: `/rooms/${newRoom.id}`,
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
        msg: "Room succesfully created",
        newRoom: newRoom,
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

    const formDataToObject = (body: FormData): Record<string, unknown> => {
      const object: Record<string, unknown> = {};
      body.forEach((value: FormDataEntryValue, key: string) => {
        object[key] = value;
      });
      return object;
    };

    const body = await req.formData();
    const bodyObject = formDataToObject(body);

    const { title, roomId, cover_img } = await editroomschema.parseAsync(
      bodyObject
    );

    const room = await db.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        cover: true,
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

    //Only admin can edit room
    if (user!.id !== room.admin_fk) {
      return NextResponse.json(
        {
          error: "Access to edit room forbidden",
        },
        { status: 403 }
      );
    }

    const updates: { [key: string]: any } = {};

    let newImageData = {
      newurl: "",
      cloudinarypublicid: "",
    };

    if (cover_img) {
      const formData = new FormData();
      formData.append("file", cover_img);
      formData.append("upload_preset", "fullstack-rooms");

      const resp = await fetch(
        "https://api.cloudinary.com/v1_1/dceom4kf4/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        return NextResponse.json(
          {
            msg: "An error occurred regarding image upload",
          },
          {
            status: data.error.message.includes("Invalid image file")
              ? 400
              : 500,
          }
        );
      }

      newImageData.cloudinarypublicid = data.public_id;
      //Format image
      const url = data.secure_url.split("upload/");
      //hvis height er under 400 og width er under 600

      if (data.width <= 600 && data.height <= 400) {
        //Scale up to the minimum required dimensions
        newImageData.newurl = `${url[0]}upload/c_fill,h_400,w_600/${url[1]}`;
      } else if (data.width >= 600 || data.height >= 400) {
        //Scale down while maintaining aspect ratio
        newImageData.newurl = `${url[0]}upload/c_fill,h_400,w_600/${url[1]}`;
      } else if (data.width === 600 && data.height === 400) {
        //No changes needed
        newImageData.newurl = data.secure_url;
      }
    }

    if (title !== room.title) {
      updates.title = title;
    }

    //no updates
    if (Object.keys(updates).length === 0 && !cover_img) {
      return NextResponse.json(
        {
          msg: "No changes made",
        },
        { status: 200 }
      );
    }

    //updated at
    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();
    updates.updated_at = isoDateString;

    //if there is image
    if (newImageData.newurl && newImageData.cloudinarypublicid) {
      if (!room.cover) {
        const result = await db.$transaction([
          //Update room
          db.room.update({
            where: { id: room.id },
            data: {
              ...updates,
            },
          }),

          //create cover
          db.cover.create({
            data: {
              formatted_url: newImageData.newurl,
              cloudinary_public_id: newImageData.cloudinarypublicid,
              room: {
                connect: {
                  id: room.id,
                },
              },
            },
          }),
        ]);

        return NextResponse.json(
          {
            msg: "Room succesfully updated",
            updatedRoom: { ...result[0], cover: { ...result[1] } },
          },
          { status: 200 }
        );
      } else if (room.cover) {
        const result = await db.$transaction([
          //Update room
          db.room.update({
            where: { id: room.id },
            data: {
              ...updates,
            },
          }),

          //create cover
          db.cover.update({
            where: {
              id: room.cover.id,
            },
            data: {
              formatted_url: newImageData.newurl,
              cloudinary_public_id: newImageData.cloudinarypublicid,
              room: {
                connect: {
                  id: room.id,
                },
              },
            },
          }),
        ]);

        //cloudinary delete old img
        const params = {
          public_id: room.cover.cloudinary_public_id,
        };
        const { timestamp, signature } = generateSignature(params);
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dceom4kf4/image/destroy?public_id=${room.cover.cloudinary_public_id}&api_key=${process.env.CLOUDINARY_API_KEY}&signature=${signature}&timestamp=${timestamp}`;
        const deleteResp = await fetch(`${cloudinaryUrl}`, {
          method: "DELETE",
        });

        if (deleteResp.ok) {
          console.log("Old image deleted successfully from Cloudinary");
        } else {
          const errorText = await deleteResp.text();
          console.error("Delete request failed:", errorText);
        }

        return NextResponse.json(
          {
            msg: "Room succesfully updated",
            updatedRoom: { ...result[0], cover: { ...result[1] } },
          },
          { status: 200 }
        );
      }
    }

    //if updates
    const updatedRoom = await db.room.update({
      where: { id: room.id },
      data: {
        ...updates,
      },
    });

    return NextResponse.json(
      {
        msg: "Ok",
        updatedRoom: updatedRoom,
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
