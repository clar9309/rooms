"use client";
import SettingsBanner from "@/app/_components/misc/SettingsBanner";
import { ExtendedRoom } from "@/app/_models/room";
import RoomSettingsMenu from "./RoomSettingsMenu";
import { useState } from "react";
import EditRoomForm from "@/app/_components/forms/EditRoomForm";
import RoomSettingsMembers from "./RoomSettingsMembers";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import RoomSettingsLocation from "./RoomSettingsLocation";

interface SettingsProps {
  roomData: ExtendedRoom;
}

function Settings({ roomData }: SettingsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParams = searchParams.get("tab");
  const [tab, setTab] = useState(tabParams ? parseInt(tabParams) : 1);
  const [room, setRoom] = useState(roomData);
  const [participants, setParticipants] = useState(roomData.participants);

  return (
    <main>
      <h2 className="text-h3 md:text-h2 mb-7 md:mt-7 font-normal">
        <span className="flex gap-2">
          <Link
            href={`/rooms/${room.id}`}
            className={"font-normal"}
            onClick={() => router.refresh()}
          >
            {room.title}
          </Link>
          <span>/</span>
          <span className="font-medium">Room settings</span>
        </span>
      </h2>
      <div className="lg:flex lg:gap-2">
        <div className="bg-dark rounded-xl lg:w-[30%] xl:w-1/4 xxl:w-1/5 lg:min-h-[calc(100vh-7.5rem)] flex flex-col">
          <SettingsBanner
            img={
              room.cover?.id ? room.cover.formatted_url : "/default_cover.png"
            }
            nameTitle={room.title}
          />

          <div className="lg:hidden">
            <RoomSettingsMenu
              tab={tab}
              setTab={setTab}
              room={room}
              setRoom={setRoom}
              participants={participants}
              setParticipants={setParticipants}
            />
          </div>

          <div className="hidden lg:block lg:min-h-[calc(100%-7rem)]">
            <ul className="h-full flex flex-col">
              <li>
                <button
                  onClick={() => setTab(1)}
                  className={`px-6 py-3 w-full border-y border-darkGrey border-opacity-30 transition hover:bg-opacity-30 hover:bg-bg_black ${
                    tab === 1
                      ? "text-white font-medium"
                      : "text-darkGrey font-normal"
                  }`}
                >
                  Edit Room
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab(2)}
                  className={`px-6 py-3 w-full border-b border-darkGrey border-opacity-30 font-medium transition hover:bg-opacity-30 hover:bg-bg_black ${
                    tab === 2
                      ? "text-white font-medium"
                      : "text-darkGrey font-normal"
                  }`}
                >
                  Members
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab(3)}
                  className={`px-6 py-3 w-full border-b border-darkGrey border-opacity-30 font-medium transition hover:bg-opacity-30 hover:bg-bg_black ${
                    tab === 3
                      ? "text-white font-medium"
                      : "text-darkGrey font-normal"
                  }`}
                >
                  Weather location
                </button>
              </li>
              <li className="mt-auto">Delete room</li>
            </ul>
          </div>
        </div>

        <div className="hidden max-h lg:block lg:w-[70%] xl:w-3/4 xxl:w-4/5 bg-dark rounded-xl p-7 xxl:px-14">
          {tab === 1 ? (
            <div>
              <EditRoomForm room={room} setRoom={setRoom} />
            </div>
          ) : tab === 2 ? (
            <div>
              <RoomSettingsMembers
                room={room}
                setRoom={setRoom}
                participants={participants}
                setParticipants={setParticipants}
              />
            </div>
          ) : (
            <RoomSettingsLocation room={room} setRoom={setRoom} />
          )}
        </div>
      </div>
    </main>
  );
}

export default Settings;
