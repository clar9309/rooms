import { useEffect } from "react";

function ErrorToast({
  msg,
  onDismiss,
}: {
  msg: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`${
        msg ? "translate-y-0" : "-translate-y-10"
      } fixed top-0 left-0 w-full bg-red-500 text-white p-4 text-center bg-primary transition duration-300 z-50`}
    >
      <p>{msg}</p>
    </div>
  );
}

export default ErrorToast;
