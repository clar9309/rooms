import { hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { UserCreateInput } from "@/lib/prisma-types";
const prisma = new PrismaClient();

async function main() {
  //STATUS
  await prisma.status.createMany({
    data: [{ title: "Available" }, { title: "Busy" }, { title: "Away" }],
  });

  //FIND DEFAULT STATUS
  const defaultStatus = await prisma.status.findUnique({
    where: {
      title: "Available",
    },
  });
  const hashedPassword = await hash("Pw12345678", 10);
  const currentDate = new Date();
  const isoDateString = currentDate.toISOString();

  //USERS
  const user1 = await prisma.user.create({
    data: {
      first_name: "Freja",
      last_name: "Smith",
      email: "freja@mail.com",
      email_verified_at: isoDateString,
      password: hashedPassword,
      birthday: "1998-11-30",
      status: { connect: { id: defaultStatus?.id } },
    },
  } as UserCreateInput);
  const user2 = await prisma.user.create({
    data: {
      first_name: "Freddy",
      last_name: "Frog",
      email: "fred@mail.com",
      email_verified_at: isoDateString,
      password: hashedPassword,
      birthday: "1997-11-10",
      status: { connect: { id: defaultStatus?.id } },
    },
  } as UserCreateInput);
  const user3 = await prisma.user.create({
    data: {
      first_name: "Cleo",
      last_name: "Zalli",
      email: "cleo@mail.com",
      email_verified_at: isoDateString,
      password: hashedPassword,
      birthday: "1998-11-30",
      status: { connect: { id: defaultStatus?.id } },
    },
  } as UserCreateInput);

  //ROOMS
  const room1 = await prisma.room.create({
    data: {
      title: "Morbærhaven",
      admin: { connect: { id: user1.id } },
    },
  });

  const room2 = await prisma.room.create({
    data: {
      title: "Cleo's Crib",
      admin: { connect: { id: user3.id } },
    },
  });

  const noteWidget1 = await prisma.noteWidget.create({
    data: {
      room: { connect: { id: room1.id } },
    },
  });

  const noteWidget2 = await prisma.noteWidget.create({
    data: {
      room: { connect: { id: room2.id } },
    },
  });

  const noteItem = await prisma.noteItem.create({
    data: {
      title: "Walk the dog",
      text: "When walking the dog remember doggie bags",
      note_widget: { connect: { id: noteWidget1.id } },
    },
  });

  // Note formatting
  await prisma.noteFormat.createMany({
    data: [
      { formatting: "bold" },
      { formatting: "italic" },
      { formatting: "underline" },
    ],
  });

  // Note formatting
  await prisma.noteAlignment.createMany({
    data: [
      { alignment: "center" },
      { alignment: "right" },
      { alignment: "left" },
    ],
  });

  const taskWidget1 = await prisma.taskWidget.create({
    data: {
      room: { connect: { id: room1.id } },
    },
  });

  const taskWidget2 = await prisma.taskWidget.create({
    data: {
      room: { connect: { id: room2.id } },
    },
  });

  const taskItem = await prisma.taskItem.create({
    data: {
      text: "Do the dishes",
      order: 1,
      checked: false,
      created_by: { connect: { id: user1.id } },
      task_widget: { connect: { id: taskWidget1.id } },
    },
  });

  //PARTICIPANTS
  // Connect user1 to both rooms
  await prisma.participant.create({
    data: {
      user: { connect: { id: user1.id } },
      room: { connect: { id: room1.id } },
      is_favourited: false,
      // Other participant data
    },
  });
  await prisma.participant.create({
    data: {
      user: { connect: { id: user1.id } },
      room: { connect: { id: room2.id } },
      is_favourited: false,
      // Other participant data
    },
  });

  // Connect user2 to both rooms
  await prisma.participant.create({
    data: {
      user: { connect: { id: user2.id } },
      room: { connect: { id: room1.id } },
      is_favourited: false,
      // Other participant data
    },
  });
  await prisma.participant.create({
    data: {
      user: { connect: { id: user2.id } },
      room: { connect: { id: room2.id } },
      is_favourited: false,
      // Other participant data
    },
  });

  // Connect user3 to both rooms
  await prisma.participant.create({
    data: {
      user: { connect: { id: user3.id } },
      room: { connect: { id: room1.id } },
      is_favourited: false,
      // Other participant data
    },
  });
  await prisma.participant.create({
    data: {
      user: { connect: { id: user3.id } },
      room: { connect: { id: room2.id } },
      is_favourited: false,
      // Other participant data
    },
  });

  //EVENTS
  //Create end_time by adding 30 minutes in milliseconds
  const endDate = new Date(currentDate.getTime() + 30 * 60000);
  //Convert to ISO format
  const isoEndDate = endDate.toISOString();
  const event1 = await prisma.event.create({
    data: {
      title: "Housewarming",
      start_time: isoDateString,
      end_time: isoEndDate,
      all_day: false,
      location: "Morbærhaven Center 2",
      description: "Come see our new apartment",
      admin: { connect: { id: user1.id } },
      room: { connect: { id: room1.id } },
    },
  });

  const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  const isoNextDay = nextDay.toISOString();
  const event2 = await prisma.event.create({
    data: {
      title: "Cleaning up",
      start_time: isoNextDay,
      all_day: true,
      location: "Morbærhaven Center 2",
      description: "Clean up the apartment",
      admin: { connect: { id: user1.id } },
      room: { connect: { id: room1.id } },
    },
  });

  const startDate = new Date(endDate.getTime() + 30 * 60000);
  const isoStartDate = startDate.toISOString();
  const anotherEndDate = new Date(startDate.getTime() + 30 * 60000);
  const isoAnotherEndDate = anotherEndDate.toISOString();

  const event3 = await prisma.event.create({
    data: {
      title: "Barking at neighbors",
      start_time: isoStartDate,
      end_time: isoAnotherEndDate,
      all_day: false,
      location: "Garden",
      description: "I wanna bark at neighbors, join if you want to",
      admin: { connect: { id: user3.id } },
      room: { connect: { id: room2.id } },
    },
  });

  //EVENT ATTENDEES
  //Connect all users to event1
  await prisma.eventAttendee.create({
    data: {
      user: { connect: { id: user1.id } },
      event: { connect: { id: event1.id } },
      reply: "accepted",
    },
  });
  await prisma.eventAttendee.create({
    data: {
      user: { connect: { id: user2.id } },
      event: { connect: { id: event1.id } },
      reply: "pending",
    },
  });

  await prisma.eventAttendee.create({
    data: {
      user: { connect: { id: user3.id } },
      event: { connect: { id: event1.id } },
      reply: "pending",
    },
  });
  //Connect all users to event2
  await prisma.eventAttendee.create({
    data: {
      user: { connect: { id: user1.id } },
      event: { connect: { id: event2.id } },
      reply: "accepted",
    },
  });
  await prisma.eventAttendee.create({
    data: {
      user: { connect: { id: user2.id } },
      event: { connect: { id: event2.id } },
      reply: "pending",
    },
  });

  await prisma.eventAttendee.create({
    data: {
      user: { connect: { id: user3.id } },
      event: { connect: { id: event2.id } },
      reply: "pending",
    },
  });
  //Connect all users to event3
  await prisma.eventAttendee.create({
    data: {
      user: { connect: { id: user1.id } },
      event: { connect: { id: event3.id } },
      reply: "pending",
    },
  });
  await prisma.eventAttendee.create({
    data: {
      user: { connect: { id: user2.id } },
      event: { connect: { id: event3.id } },
      reply: "pending",
    },
  });

  await prisma.eventAttendee.create({
    data: {
      user: { connect: { id: user3.id } },
      event: { connect: { id: event3.id } },
      reply: "accepted",
    },
  });

  //NOTIFICATIONS
  await prisma.notification.create({
    data: {
      read: false,
      user: { connect: { id: user3.id } },
      meta_user: { connect: { id: user1.id } },
      meta_action: "created",
      meta_target: "room",
      meta_target_name: "Morbærhaven",
      meta_link: `/rooms/${room1.id}`,
    },
  });
  await prisma.notification.create({
    data: {
      read: false,
      user: { connect: { id: user2.id } },
      meta_user: { connect: { id: user1.id } },
      meta_action: "created",
      meta_target: "room",
      meta_target_name: "Morbærhaven",
      meta_link: `/rooms/${room1.id}`,
    },
  });

  await prisma.notification.create({
    data: {
      read: false,
      user: { connect: { id: user1.id } },
      meta_user: { connect: { id: user3.id } },
      meta_action: "created",
      meta_target: "room",
      meta_target_name: "Cleo's Crib",
      meta_link: `/rooms/${room2.id}`,
    },
  });

  await prisma.notification.create({
    data: {
      read: false,
      user: { connect: { id: user2.id } },
      meta_user: { connect: { id: user3.id } },
      meta_action: "created",
      meta_target: "room",
      meta_target_name: "Cleo's Crib",
      meta_link: `/rooms/${room2.id}`,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
