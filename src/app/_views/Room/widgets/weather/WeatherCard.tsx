import WeatherIcon from "./WeatherIcon";

function WeatherCard({ w, index }: any) {
  function formatHour(dateString: string) {
    const time = dateString.split(" ")[1];
    const hour = time.split(":")[0];

    return hour;
  }

  return (
    <li className="grid justify-start md:justify-center">
      <span className="flex justify-center items-center text-sm">
        {index === 0 ? "Now" : formatHour(w.dt_txt)}
      </span>
      <span className="flex justify-center items-center">
        <WeatherIcon main={w.weather[0].main} wind={w.wind.speed} />
      </span>
      <span className="flex justify-center items-center font-medium text-base">
        {Math.round(w.main.temp)}°
      </span>
    </li>
  );
}

export default WeatherCard;
