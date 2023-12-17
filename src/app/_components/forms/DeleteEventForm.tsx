import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function DeleteEventForm({
  eventId,
  roomId,
  setResponseMsg,
}: {
  eventId: string;
  roomId: string;
  setResponseMsg: (responseMsg: string) => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleOnChange = async () => {
    if (session) {
      const resp = await fetch(`/api/events`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token.sub}`,
        },
        body: JSON.stringify({ eventId: eventId }),
      });
      if (resp.ok) {
        const data = await resp.json();
        //@TODO route
        //router.push(`/rooms/${roomId}/events`);
        router.push(`/calendar`);
      } else {
        setResponseMsg("An error occurred");
      }
    }
  };

  return (
    <button
      onClick={() => handleOnChange()}
      className="text-sm text-warning text-opacity-80 transition px-3 py-1 rounded-full
    hover:bg-warning hover:bg-opacity-10 hover:border-warning hover:text-opacity-100"
    >
      Delete event
    </button>
  );
}

export default DeleteEventForm;
