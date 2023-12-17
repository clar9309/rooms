import RoomsList from "./RoomsList";
import DigitalClock from "@/app/_components/layout/DigitalClock";
import { User } from "next-auth";
import RoomCreateModal from "./RoomCreateModal";

interface RoomsProps {
  sessionUser: User;
}

function Rooms(props: RoomsProps) {
  const { sessionUser } = props;

  return (
    <div>
      <div className="flex justify-end md:justify-between">
        <DigitalClock
          title={`Welcome, ${
            sessionUser.first_name + " " + sessionUser.last_name
          }`}
        />
        <div className="md:pt-7 mb-6 md:mb-0">
          <RoomCreateModal />
        </div>
      </div>
      <div>
        <h1 className="text-h2 font-medium text-center md:text-h2">
          {sessionUser.first_name + " " + sessionUser.last_name}, Pick your
          dashboard
        </h1>

        <RoomsList />
      </div>
    </div>
  );
}

export default Rooms;
