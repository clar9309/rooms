"use client";

interface ModalProps {
  children: JSX.Element;
  setIsOpen: (isOpen: boolean) => void;
}

function Modal(props: ModalProps) {
  return (
    <div className="absolute top-0 right-0 w-screen h-screen bg-bg_black bg-opacity-40 z-40 flex justify-center md:py-12 xl:py-24">
      <div className="relative z-50 bg-dark rounded-xl w-full h-full md:max-w-5xl p-8 grid overflow-y-scroll md:overflow-y-hidden">
        <button
          className="absolute top-6 right-6 z-50 transition hover:bg-white hover:bg-opacity-5 p-2 rounded-full"
          onClick={() => props.setIsOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M13 1L7 7M1 13L7 7M7 7L1 1M7 7L13 13"
              stroke="#8F8F8F"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        <div className="mt-4">{props.children}</div>
      </div>
    </div>
  );
}

export default Modal;
