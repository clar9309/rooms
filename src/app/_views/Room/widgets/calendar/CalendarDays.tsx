import { CalendarDay } from "@/app/_models/event";

interface CalendarDaysProps {
  calendarDayData: CalendarDay[];
  onCallBack: (fullDate: string) => void;
  activeDate: string;
}

function CalendarDays({
  calendarDayData,
  onCallBack,
  activeDate,
}: CalendarDaysProps) {
  return (
    <ul className="grid grid-cols-7 xxl:flex gap-1 md:gap-3">
      {calendarDayData.map((d, index) => (
        <li key={d.fullDate} className={`rounded-md w-full`}>
          <button
            onClick={() => onCallBack(d.fullDate)}
            className={`grid content-center gap-1 rounded-md border w-full xxl:min-w-[5rem] min-h-[6rem] transition ${
              activeDate === d.fullDate
                ? "bg-white border-white text-bg_black"
                : "bg-none  border-primary text-white hover:bg-white hover:bg-opacity-10"
            }`}
          >
            <span className="font-medium text-h4">{d.date}</span>
            <span className="text-sm md:text-base">
              {index === 0 ? "Today" : d.day}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default CalendarDays;
