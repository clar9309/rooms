"use client";
import LiveClock from "react-live-clock";

function DigitalClockHeader({ title }: { title: string }) {
  return (
    <div className="hidden md:block pt-7 md:mb-20">
      <div className="h-[7.57rem]">
        <LiveClock
          className="text-display font-medium"
          ticking={true}
          noSsr
          format={"HH:mm"}
        />
      </div>
      <h2 className="text-h3 mt-2">{title}</h2>
    </div>
  );
}

export default DigitalClockHeader;
