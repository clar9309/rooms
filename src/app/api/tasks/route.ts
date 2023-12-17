import { db } from "@/lib/prisma-client";
import { UserId } from "@/app/_models/user";
import { notifyUsers } from "@/app/_utils/apis/notification";
import { authenticateUser } from "@/app/_utils/authentication/authenticateUser";
import * as z from "zod";
import { NextRequest, NextResponse } from "next/server";
import taskcreateschema from "@/app/_utils/validation/schemas/backend/task-create-schema";

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
    //

    const body = await req.json();
    const { text, task_widget_fk, created_by_fk, roomId } =
      taskcreateschema.parse(body);

    // Finding the room that belongs to roomId
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
        task_widget: true,
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

    if (!room.task_widget || room.task_widget.id !== task_widget_fk) {
      return NextResponse.json(
        {
          error: "Taskwidget not found",
        },
        { status: 404 }
      );
    }

    // Check that user.id exist in participants
    const isUserParticipant = room.participants.some(
      (p) => p.user_id === user!.id
    );

    if (!isUserParticipant) {
      return NextResponse.json(
        {
          error: "User is not a participant in the room",
        },
        { status: 403 }
      );
    }

    // Query the database to get the count of existing tasks
    const existingTasksCount = await db.taskItem.count({
      where: {
        task_widget_fk: room.task_widget.id,
      },
    });
    // Create task
    const createdTask = await db.taskItem.create({
      data: {
        text: text,
        task_widget_fk,
        order: existingTasksCount,
        checked: false,
        created_by_fk: created_by_fk,
      },
    });

    // This is the room participant without the creator of the task
    const otherParticipations = room.participants.filter(
      (p) => p.user_id !== user!.id
    );

    // Create notifications
    if (otherParticipations.length !== 0) {
      try {
        const notifications = await Promise.all(
          otherParticipations.map(async (p) => {
            try {
              const notification = await db.notification.create({
                data: {
                  read: false,
                  user: { connect: { id: p.user_id } },
                  meta_user: { connect: { id: user!.id } },
                  meta_action: "created",
                  meta_target: "task",
                  meta_target_name: createdTask.text,
                  meta_link: `/rooms/${room.id}/?modal=true`,
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
            msg: "Created a task!",
          }
        );

        if (!notificationResult.success) {
          console.error("Error: Pusher notification trigger for task actions");
        }
      } catch (error) {
        console.error(
          "Error occurred while creating notifications in create task"
        );
      }
    }

    return NextResponse.json(
      { msg: "success", createdTask: createdTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
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
    //
    const paramsIsOrder = req.nextUrl.searchParams.get("orderUpdate");
    const updateBody = await req.json();

    if (paramsIsOrder) {
      // make order update
      const { tasks } = updateBody;
      // If the order has changed, update the order of other tasks
      const updatedTasks = await Promise.all(
        tasks.map(
          async ({ id }: { id: string }, { index }: { index: number }) => {
            const updatedTask = await db.taskItem.update({
              where: { id: id },
              data: { order: index },
            });
            return updatedTask;
          }
        )
      );

      return NextResponse.json(
        { msg: "success", updatedTasks: updatedTasks },
        { status: 200 }
      );
    } else {
      // update checkhed here
      const { id, checked, updated_by, order, task_widget_fk, roomId } =
        updateBody;

      // Finding the room that belongs to roomId
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
          task_widget: true,
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

      if (!room.task_widget || room.task_widget.id !== task_widget_fk) {
        return NextResponse.json(
          {
            error: "Taskwidget not found",
          },
          { status: 404 }
        );
      }

      // Assuming you have a Task model in your Prisma schema
      const existingTask = await db.taskItem.findUnique({
        where: { id: id },
      });
      if (!existingTask) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      // Save the current order before updating
      const currentOrder = existingTask.order;

      // Update the task with the new order
      const updatedTask = await db.taskItem.update({
        where: { id: id },
        data: {
          checked,
          updated_by,
          order: currentOrder,
        },
      });

      // Check that user.id exist in participants
      const isUserParticipant = room.participants.some(
        (p) => p.user_id === user!.id
      );

      if (!isUserParticipant) {
        return NextResponse.json(
          {
            error: "User is not a participant in the room",
          },
          { status: 403 }
        );
      }

      // This is the room participant without the creator of the task
      const otherParticipations = room.participants.filter(
        (p) => p.user_id !== user!.id
      );

      // Create notifications
      if (otherParticipations.length !== 0) {
        try {
          const notifications = await Promise.all(
            otherParticipations.map(async (p) => {
              try {
                const notification = await db.notification.create({
                  data: {
                    read: false,
                    user: { connect: { id: p.user_id } },
                    meta_user: { connect: { id: user!.id } },
                    meta_action: "edited",
                    meta_target: "task",
                    meta_target_name: updatedTask.text,
                    meta_link: `/rooms/${room.id}/?modal=true`,
                  },
                  select: {
                    user_id: true,
                  },
                });
                return notification;
              } catch (error) {
                console.error(
                  `Error occurred while editing a notification for ${p}:`,
                  error
                );
                return null;
              }
            })
          );

          const notificationResult = await notifyUsers(
            notifications as UserId[],
            {
              msg: "Added to room!",
            }
          );

          if (!notificationResult.success) {
            console.error(
              "Error: Pusher notification trigger for task actions"
            );
          }
        } catch (error) {
          console.error(
            "Error occurred while creating notifications in update task"
          );
        }
      }

      return NextResponse.json(
        { msg: "success", updatedTask: updatedTask },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
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

export async function DELETE(req: NextRequest) {
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
    //
    const deleteBody = await req.json();

    const { id, roomId, task_widget_fk } = deleteBody;

    // Finding and checking the room that belongs to roomId
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
        task_widget: true,
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

    if (!room.task_widget || room.task_widget.id !== task_widget_fk) {
      return NextResponse.json(
        {
          error: "Taskwidget not found",
        },
        { status: 404 }
      );
    }

    // Check that user.id exist in participants
    const isUserParticipant = room.participants.some(
      (p) => p.user_id === user!.id
    );

    if (!isUserParticipant) {
      return NextResponse.json(
        {
          error: "User is not a participant in the room",
        },
        { status: 403 }
      );
    }

    // Find the task to be deleted
    const taskToDelete = await db.taskItem.findUnique({
      where: {
        id: id,
      },
    });

    if (!taskToDelete) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const orderToDelete = taskToDelete.order;

    // Delete the task
    const deletedTask = await db.taskItem.delete({
      where: {
        id: id,
      },
    });

    // Update the order of the remaining tasks
    await db.taskItem.updateMany({
      where: {
        order: {
          gt: orderToDelete,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });

    // This is the room participant without the creator of the task
    const otherParticipations = room.participants.filter(
      (p) => p.user_id !== user!.id
    );

    // Create notifications
    if (otherParticipations.length !== 0) {
      try {
        const notifications = await Promise.all(
          otherParticipations.map(async (p) => {
            try {
              const notification = await db.notification.create({
                data: {
                  read: false,
                  user: { connect: { id: p.user_id } },
                  meta_user: { connect: { id: user!.id } },
                  meta_action: "deleted",
                  meta_target: "task",
                  meta_target_name: deletedTask.text,
                  meta_link: `/rooms/${room.id}/?modal=true`,
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
            msg: "Deleted a task!",
          }
        );

        if (!notificationResult.success) {
          console.error("Error: Pusher notification trigger for task actions");
        }
      } catch (error) {
        console.error(
          "Error occurred while creating notifications in delete task"
        );
      }
    }

    return NextResponse.json(
      { msg: "succes", deletedTask: deletedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
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
