"use client";
import CreateRoomForm from "@/app/_components/forms/CreateRoomForm";
import { useState } from "react";
import dynamic from "next/dynamic";

const DynamicModal = dynamic(() => import("@/app/_components/modals/Modal"), {
  ssr: false,
});

function RoomCreateModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="primary-btn">
        <span>Create new room</span>
      </button>
      {isOpen && (
        <DynamicModal setIsOpen={setIsOpen}>
          <CreateRoomForm />
        </DynamicModal>
      )}
    </>
  );
}

export default RoomCreateModal;
