import { ReactNode } from "react";

interface ServerModalProps {
  children?: ReactNode;
}

export default function ServerModal({ children }: ServerModalProps) {
  // ... (your existing modal code)

  return (
    <div
      className="fixed z-20 inset-0 overflow-y-auto"
      id="error-modal"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex bg-bg_black bg-opacity-80 items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* span for top spacing */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          style={{ height: "65vh" }}
          className="h-full w-full inline-block align-bottom bg-dark rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full "
        >
          <div className="h-full w-full px-4 relative md:px-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
