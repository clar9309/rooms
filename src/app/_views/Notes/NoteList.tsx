"use client";
import { NoteItem } from "@prisma/client";
import NoteCard from "./NoteCard";
import Link from "next/link";

interface NoteListProps {
  notes?: NoteItem[];
  roomId: string;
}

function NoteList(props: NoteListProps) {
  return (
    <div className="py-7 grid md:grid-cols-4 gap-5 justify-center items-center">
      {props.notes?.length === 0 ? (
        <p className="text-base text-darkGrey mb-2">
          There are not any notes yet
        </p>
      ) : (
        props.notes?.map((note: NoteItem) => (
          <Link key={note.id} href={`/rooms/${props.roomId}/notes/${note.id}`}>
            <NoteCard
              title={note.title}
              text={note.text}
              date={note.created_at}
            />
          </Link>
        ))
      )}
    </div>
  );
}
export default NoteList;
