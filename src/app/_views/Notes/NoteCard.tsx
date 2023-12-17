"use client";
import { formatDate } from "@/app/_utils/helpers/date";

interface NoteCardProps {
  title: string;
  text: string;
  date: Date;
  isWidget?: boolean;
}

function NoteCard(props: NoteCardProps) {
  const newDate = formatDate(props.date);

  return (
    <article
      className={`bg-primary rounded-xl p-5 flex flex-col group-hover:bg-opacity-10 group-hover:bg-grey ${
        props.isWidget ? "h-[12rem]" : "md:h-[180px] "
      }`}
    >
      <div className="flex justify-between items-center mt-2 mb-4">
        <p className="text-xs text-secondary">{newDate}</p>
      </div>
      <div>
        <h2 className="mt-2 text-xl font-bold text-white">{props.title}</h2>
        <p className="text-white opacity-80 text-sm mt-2">{props.text}</p>
      </div>
      {props.isWidget && (
        <p className="text-xs text-right text-darkGrey mt-auto ml-auto">
          All notes
        </p>
      )}
    </article>
  );
}
export default NoteCard;
