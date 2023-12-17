"use client";
import Link from "next/link";
import { NoteItem, Room, TaskItem } from "@prisma/client";
import { CalendarDay } from "@/app/_models/event";
import { ExpandedTaskWidget } from "@/app/_models/tasks";
import { useSession } from "next-auth/react";
import DigitalClock from "@/app/_components/layout/DigitalClock";
import NoteCard from "../Notes/NoteCard";
import TaskWidget from "@/app/_views/Room/widgets/task/TaskWidget";
import TaskModal from "@/app/_views/Tasks/TaskModal";
import ServerModal from "@/app/_components/modals/ServerModal";
import WeatherWidget from "./widgets/weather/WeatherWidget";
import CalendarWidget from "./widgets/calendar/CalendarWidget";
import ParticipantsWidget from "./widgets/particpants/ParticipantsWidget";
import { useState } from "react";

interface Roomprops {
  room: Room;
  modalParams: { modal: string } | undefined | null;
  taskWidget: ExpandedTaskWidget | null;
  calendarDayData: CalendarDay[];
  noteItem?: NoteItem;
  weatherData?: any;
}

function RoomView(props: Roomprops) {
  const { data: session } = useSession();
  const [taskList, setTaskList] = useState<TaskItem[]>(
    props.taskWidget?.task_item || []
  );

  return (
    <main className="max-w-[79rem] xxl:ml-20">
      <div className="flex md:justify-between justify-end mb-2 md:mb-0">
        <DigitalClock title={`Welcome, ${props.room.title}`} />
        {props.room.admin_fk === session?.user.id && (
          <Link
            className="self-start md:mt-7 hover:bg-white hover:bg-opacity-10 p-2 rounded-md"
            href={`/rooms/${props.room.id}/settings`}
          >
            <svg
              className="w-5 h-5"
              width="27"
              height="28"
              viewBox="0 0 27 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.815 15.372C23.8705 14.924 23.9121 14.476 23.9121 14C23.9121 13.524 23.8705 13.076 23.815 12.628L26.7434 10.318C27.0071 10.108 27.0765 9.73004 26.9099 9.42204L24.1342 4.57805C24.0523 4.43361 23.9222 4.32328 23.7671 4.26684C23.6119 4.2104 23.4419 4.21154 23.2876 4.27006L19.8318 5.67005C19.1101 5.11005 18.3329 4.64805 17.4863 4.29806L16.9589 0.588064C16.9359 0.423342 16.8542 0.27273 16.729 0.164475C16.6037 0.0562213 16.4437 -0.00223682 16.2788 6.55043e-05H10.7273C10.3804 6.55043e-05 10.0889 0.252065 10.0473 0.588064L9.51987 4.29806C8.67327 4.64805 7.89606 5.12405 7.17437 5.67005L3.71857 4.27006C3.6381 4.24252 3.55373 4.22833 3.46875 4.22806C3.23281 4.22806 2.99688 4.35405 2.87197 4.57805L0.0962233 9.42204C-0.0842 9.73004 -0.000927518 10.108 0.262768 10.318L3.19118 12.628C3.13566 13.076 3.09403 13.538 3.09403 14C3.09403 14.462 3.13566 14.924 3.19118 15.372L0.262768 17.682C-0.000927518 17.892 -0.0703213 18.27 0.0962233 18.578L2.87197 23.422C2.95378 23.5665 3.08392 23.6768 3.23906 23.7332C3.3942 23.7897 3.56419 23.7885 3.71857 23.73L7.17437 22.33C7.89606 22.89 8.67327 23.352 9.51987 23.702L10.0473 27.412C10.0889 27.748 10.3804 28 10.7273 28H16.2788C16.6258 28 16.9172 27.748 16.9589 27.412L17.4863 23.702C18.3329 23.352 19.1101 22.876 19.8318 22.33L23.2876 23.73C23.3708 23.758 23.4541 23.772 23.5374 23.772C23.7733 23.772 24.0093 23.646 24.1342 23.422L26.9099 18.578C27.0765 18.27 27.0071 17.892 26.7434 17.682L23.815 15.372ZM21.067 12.978C21.1225 13.412 21.1364 13.706 21.1364 14C21.1364 14.294 21.1086 14.602 21.067 15.022L20.8727 16.604L22.1079 17.584L23.6068 18.76L22.6353 20.454L20.8727 19.74L19.4293 19.152L18.1802 20.104C17.5834 20.552 17.0144 20.888 16.4454 21.126L14.9742 21.728L14.7521 23.31L14.4746 25.2H12.5316L12.2679 23.31L12.0458 21.728L10.5747 21.126C9.97787 20.874 9.42272 20.552 8.86757 20.132L7.60461 19.152L6.13347 19.754L4.37087 20.468L3.39936 18.774L4.89826 17.598L6.13347 16.618L5.93916 15.036C5.89753 14.602 5.86977 14.28 5.86977 14C5.86977 13.72 5.89753 13.398 5.93916 12.978L6.13347 11.396L4.89826 10.416L3.39936 9.24004L4.37087 7.54605L6.13347 8.26005L7.57685 8.84804L8.82594 7.89605C9.42272 7.44805 9.99175 7.11205 10.5608 6.87405L12.0319 6.27205L12.254 4.69005L12.5316 2.80006H14.4607L14.7244 4.69005L14.9465 6.27205L16.4176 6.87405C17.0144 7.12605 17.5695 7.44805 18.1247 7.86805L19.3876 8.84804L20.8588 8.24605L22.6214 7.53205L23.5929 9.22604L22.1079 10.416L20.8727 11.396L21.067 12.978ZM13.5031 8.40005C10.4359 8.40005 7.95158 10.906 7.95158 14C7.95158 17.094 10.4359 19.6 13.5031 19.6C16.5703 19.6 19.0546 17.094 19.0546 14C19.0546 10.906 16.5703 8.40005 13.5031 8.40005ZM13.5031 16.8C11.9764 16.8 10.7273 15.54 10.7273 14C10.7273 12.46 11.9764 11.2 13.5031 11.2C15.0297 11.2 16.2788 12.46 16.2788 14C16.2788 15.54 15.0297 16.8 13.5031 16.8Z"
                fill="#9A9A9A"
              />
            </svg>
          </Link>
        )}
      </div>
      <section className="grid gap-10 lg:flex lg:gap-8">
        <div className="grid gap-3 w-full lg:w-1/2 max-w-[39.5rem] row-start-2 lg:row-start-1">
          <WeatherWidget
            roomData={props.room}
            weatherData={props.weatherData}
          />

          <div className="grid md:flex gap-3">
            <div className="md:w-1/2">
              <Link
                href={`/rooms/${props.room.id}/notes`}
                className="grid bg-primary rounded-xl group h-[12rem]"
              >
                {props.noteItem ? (
                  <NoteCard
                    title={props.noteItem.title}
                    text={props.noteItem.text}
                    date={props.noteItem.created_at}
                    isWidget
                  />
                ) : (
                  <div className="p-5 group-hover:bg-opacity-10 group-hover:bg-grey flex flex-col justify-center">
                    <div className="h-full flex flex-col justify-center">
                      <p className="text-h3 mb-2">No notes yet</p>
                      <p className="text-base text-darkGrey mb-2">
                        There are not any notes yet
                      </p>
                    </div>
                    <svg
                      className="ml-auto mt-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="19"
                      viewBox="0 0 20 19"
                      fill="none"
                    >
                      <path
                        d="M18.1 6.7502V18.0002H1V2.7002H12.4"
                        stroke="#E4E4E4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.64645 9.54802L9.29289 9.90158L10 10.6087L10.3536 10.2551L9.64645 9.54802ZM16.6536 3.95512C16.8488 3.75985 16.8488 3.44327 16.6536 3.24801C16.4583 3.05275 16.1417 3.05275 15.9465 3.24801L16.6536 3.95512ZM10.3536 10.2551L16.6536 3.95512L15.9465 3.24801L9.64645 9.54802L10.3536 10.2551Z"
                        fill="#E4E4E4"
                      />
                      <path
                        d="M16.8464 2.34684L16.4928 2.70039L17.2 3.4075L17.5535 3.05395L16.8464 2.34684ZM19.3535 1.25394C19.5488 1.05868 19.5488 0.742099 19.3535 0.546837C19.1582 0.351575 18.8417 0.351575 18.6464 0.546837L19.3535 1.25394ZM17.5535 3.05395L19.3535 1.25394L18.6464 0.546837L16.8464 2.34684L17.5535 3.05395Z"
                        fill="#E4E4E4"
                      />
                    </svg>
                  </div>
                )}
              </Link>
            </div>

            <div className="md:w-1/2">
              <Link
                href={`/rooms/${props.room.id}/?modal=true`}
                className="bg-primary rounded-xl grid group"
              >
                <>
                  <div
                    className={`h-[12rem] p-5 group-hover:bg-opacity-10 group-hover:bg-grey rounded-xl
                    ${taskList.length === 0 && "flex items-center"}`}
                  >
                    <TaskWidget
                      tasks={taskList}
                      room={props.room}
                      taskWidgetId={props.taskWidget!.id}
                      modalParams={props.modalParams}
                    />
                  </div>
                </>
              </Link>

              {props.modalParams?.modal && (
                <ServerModal>
                  <TaskModal
                    taskList={taskList}
                    setTaskList={setTaskList}
                    room={props.room}
                    taskWidgetId={props.taskWidget!.id}
                  />
                </ServerModal>
              )}
            </div>
          </div>
          <div className="w-full p-5 bg-primary rounded-xl">
            <ParticipantsWidget room={props.room} />
          </div>
        </div>
        <CalendarWidget
          calendarDayData={props.calendarDayData}
          roomId={props.room.id}
        />
      </section>
    </main>
  );
}

export default RoomView;
