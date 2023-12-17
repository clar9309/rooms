"use client";
import LogoutButton from "@/app/_components/LogoutButton";
import EditUserForm from "@/app/_components/forms/EditUserForm";
import { UserEdit } from "@/app/_models/user";
import { Status } from "@prisma/client";
import { useState } from "react";

interface ProfileSettingsMenuProps {
  profile: UserEdit;
  statusOptions: Status[];
}

function ProfileSettingsMenu(props: ProfileSettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ul>
        <li>
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 w-full border-y border-darkGrey border-opacity-30 font-medium transition hover:bg-opacity-20 hover:bg-bg_black"
          >
            Edit profile
          </button>
        </li>
        <li>
          <button className="px-6 py-3 w-full border-b border-darkGrey border-opacity-30 font-medium transition hover:bg-opacity-20 hover:bg-bg_black cursor-auto">
            Change password
          </button>
        </li>
        <li>
          <button className="px-6 py-3 w-full border-b border-darkGrey border-opacity-30 font-medium transition hover:bg-opacity-20 hover:bg-bg_black cursor-auto">
            Notifications
          </button>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
      {isOpen && (
        <div className="absolute top-0 left-0 h-0 min-h-screen z-10 bg-bg_black w-full px-6 md:w-[calc(100%-7.5rem)] md:ml-[7.5rem]">
          <div className="flex gap-2 text-h4 mt-4">
            <button onClick={() => setIsOpen(false)}>Settings</button>
            <span>/</span>
            <button className="font-medium">Edit profile</button>
          </div>
          <EditUserForm
            profile={props.profile}
            statusOptions={props.statusOptions}
          />
        </div>
      )}
    </div>
  );
}

export default ProfileSettingsMenu;
