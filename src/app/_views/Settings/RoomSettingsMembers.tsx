import EditRoomParticipantsRoom from "@/app/_components/forms/EditRoomParticipantsForm";
import { ExtendedRoom } from "@/app/_models/room";
import ParticipantCard from "./ParticipantCard";
import { ExtendedParticipant } from "@/app/_models/participant";

interface RoomSettingsMembersProps {
  room: ExtendedRoom;
  setRoom: (room: ExtendedRoom) => void;
  participants?: ExtendedParticipant[];
  setParticipants: (participants: ExtendedParticipant[]) => void;
}

function RoomSettingsMembers(props: RoomSettingsMembersProps) {
  return (
    <div>
      <div className="mb-12">
        <h2 className="text-h3 font-medium hidden md:block">Members</h2>

        <ul className="flex flex-col border-t border-grey border-opacity-30 mt-5">
          {props.participants?.map((p) => (
            <ParticipantCard
              key={p.id}
              {...p}
              room={props.room}
              participants={props.participants}
              setParticipants={props.setParticipants}
            />
          ))}
        </ul>
      </div>
      <EditRoomParticipantsRoom
        room={props.room}
        setRoom={props.setRoom}
        participants={props.participants}
        setParticipants={props.setParticipants}
      />
    </div>
  );
}

export default RoomSettingsMembers;
