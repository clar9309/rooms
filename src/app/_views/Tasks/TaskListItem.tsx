"use client";

type TaskListItemProps = {
  text: string;
  checked: boolean;
};

function TaskListItem({ text, checked }: TaskListItemProps) {
  return (
    <li className="flex gap-2 items-center">
      <div className="min-w-5">
        <span
          className={`flex w-5 h-5 border rounded-full justify-center items-center ${
            checked ? "bg-[#7A561F] border-[#7A561F]" : "border-grey"
          }`}
        >
          {checked && (
            <svg
              className="stroke-primary text-bg_black"
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="8"
              viewBox="0 0 9 8"
              fill="none"
            >
              <path d="M1 5L3.8 7L8 1" stroke="#DADADA" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </div>
      <p className="text-sm text-darkGrey mb-1">{text}</p>
    </li>
  );
}

export default TaskListItem;
