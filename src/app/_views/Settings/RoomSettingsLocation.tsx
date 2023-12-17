import LocationForm from "@/app/_components/forms/LocationForm";
import SearchCitiesForm from "@/app/_components/forms/SearchCitiesForm";
import { City } from "@/app/_models/location";
import { ExtendedRoom } from "@/app/_models/room";
import { useState } from "react";

interface RoomSettingsLocationProps {
  room: ExtendedRoom;
  setRoom: (room: ExtendedRoom) => void;
}

function RoomSettingsLocation({ room, setRoom }: RoomSettingsLocationProps) {
  const [cityResult, setCityResult] = useState<City[]>([]);

  return (
    <div>
      <h2 className="text-h3 font-medium hidden md:block mb-2">
        Weather location
      </h2>
      <h2 className="text-h5 font-medium md:hidden mb-2 mt-6">
        Current location:
      </h2>
      <div>
        {room.location ? (
          <p>
            {room.location.city},{" "}
            {room.location.state && room.location.state + ", "}
            {room.location.country}
          </p>
        ) : (
          <p className="text-darkGrey">
            No location added, add a location down below
          </p>
        )}
      </div>
      <div className="mt-12">
        <h2 className="text-h3 font-medium mb-1">Search for cities</h2>
        <p className="mb-4 text-darkGrey">
          Here you can search for a weather location by looking up cities
        </p>

        <SearchCitiesForm
          setCityResult={setCityResult}
          cityResult={cityResult}
        />
        <div>
          {cityResult.length !== 0 && (
            <div>
              <p className="text-right mb-2 text-sm">
                Results: {cityResult.length}
              </p>
              <ul className="border-t border-grey">
                {cityResult.map((city) => (
                  <LocationForm
                    key={city.id}
                    roomId={room.id}
                    city={city}
                    hasLocation={room.location ? true : false}
                    setCityResult={setCityResult}
                    setRoom={setRoom}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomSettingsLocation;
