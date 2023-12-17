import { Location } from "@prisma/client";
import { useState } from "react";
import WeatherCard from "./WeatherCard";

interface WeatherProps {
  weatherData: any;
  locationData: Location;
}

function Weather({ weatherData, locationData }: WeatherProps) {
  const [weather, setWeather] = useState(weatherData);
  return (
    <div className="flex gap-6 p-5 flex-wrap md:flex-nowrap">
      <div className="whitespace-nowrap">
        <h2 className="text-base font-medium mb-1 ">{locationData.city}</h2>
        <h3 className="text-h2 mb-2">{Math.round(weather[0].main.temp)}°</h3>
        <p className="text-white text-opacity-80 text-sm">
          {weather[0].weather[0].main}, {weather[0].weather[0].description}
        </p>
        <p className="text-white text-opacity-80 text-xs">
          Feels like: {Math.round(weather[0].main.feels_like)}
        </p>
      </div>
      <ul className="grid grid-cols-6 pt-3 md:pt-0 md:flex md:justify-evenly w-full border-t md:border-t-0 md:border-l border-grey border-opacity-30">
        {weather.map((w: any, index: number) => (
          <WeatherCard key={w.dt} w={w} index={index} />
        ))}
      </ul>
    </div>
  );
}
export default Weather;
