import { CalendarDay } from "@/app/_models/event";

export function formatDate(date: Date, eventDetail?: boolean) {
  const jsDate = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
    jsDate
  );
  const time = jsDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (eventDetail) {
    const finalFormat = `${formattedDate} ${time}`;

    return finalFormat;
  } else {
    const finalFormat = `${time} - ${formattedDate}`;
    return finalFormat;
  }
}

export async function getCalendarDays() {
  const today = new Date();
  const daysList = [];

  function getDayName(date: Date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }

  const todayDayName = getDayName(today);
  const todayDate = today.getDate();

  daysList.push({
    date: todayDate,
    day: todayDayName,
    fullDate: today.toISOString().split("T")[0],
  });

  for (let i = 1; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const dayName = getDayName(nextDate);
    const fullDate = nextDate.toISOString().split("T")[0];
    daysList.push({ date: nextDate.getDate(), day: dayName, fullDate });
  }

  return daysList as CalendarDay[];
}

export function formatTime(date: Date) {
  const newDate = new Date(date);

  const hours = newDate.getHours().toString().padStart(2, "0");
  const minutes = newDate.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}
