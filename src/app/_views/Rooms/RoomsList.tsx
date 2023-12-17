"use client";
import RoomCard from "./RoomCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ExtendedRoom } from "@/app/_models/room";

function RoomsList() {
  //@TODO add favorite rooms
  const [rooms, setRooms] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    async function getRooms() {
      const resp = await fetch(`/api/rooms`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session!.token.sub}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setRooms(data.data);
      } else {
        console.log("Error fetching rooms");
      }
    }
    if (session) {
      getRooms();
    }
  }, [session]);
  return (
    <div className="py-7 flex flex-col gap-5 justify-center items-center md:flex-wrap md:flex-row">
      {rooms.length !== 0 &&
        rooms.map((room: ExtendedRoom) => {
          return <RoomCard key={room.id} {...room} />;
        })}
    </div>
  );
}

export default RoomsList;
