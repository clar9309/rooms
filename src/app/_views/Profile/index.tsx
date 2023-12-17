"use client";
import { UserEdit } from "@/app/_models/user";
import { Status } from "@prisma/client";
import ProfileSettingsMenu from "./ProfileSettingsMenu";
import LogoutButton from "@/app/_components/LogoutButton";
import EditUserForm from "@/app/_components/forms/EditUserForm";
import SettingsBanner from "@/app/_components/misc/SettingsBanner";
import { useSession } from "next-auth/react";

interface Profileprops {
  profile: UserEdit;
  statusOptions: Status[];
}

function ProfileView(props: Profileprops) {
  const { data: session } = useSession();

  return (
    <main>
      <h2 className="text-h2 mb-7 md:mt-7">Profile settings</h2>
      <div className="lg:flex lg:gap-2">
        <div className="bg-dark rounded-xl lg:w-[30%] xl:w-1/4 xxl:w-1/5 lg:min-h-[calc(100vh-7.5rem)] flex flex-col">
          {session && (
            <SettingsBanner
              img={
                session.user.image ? session.user.image : "/default_avatar.png"
              }
              nameTitle={`${session.user.first_name} ${session.user.last_name}`}
              subTitle={session.user.email as string}
            />
          )}

          <div className="lg:hidden">
            <ProfileSettingsMenu
              profile={props.profile}
              statusOptions={props.statusOptions}
            />
          </div>

          <div className="hidden lg:block lg:min-h-[calc(100%-7rem)]">
            <ul className="h-full flex flex-col">
              <li>
                <button className="px-6 py-3 w-full border-y border-darkGrey border-opacity-30 font-medium transition hover:bg-opacity-20 hover:bg-bg_black">
                  Edit profile
                </button>
              </li>
              <li>
                <button className="text-darkGrey px-6 py-3 w-full border-b border-darkGrey border-opacity-30 font-medium transition hover:bg-opacity-20 hover:bg-bg_black cursor-auto">
                  Change password
                </button>
              </li>
              <li>
                <button className="text-darkGrey px-6 py-3 w-full border-b border-darkGrey border-opacity-30 font-medium transition hover:bg-opacity-20 hover:bg-bg_black cursor-auto">
                  Notifications
                </button>
              </li>
              <li className="mt-auto">
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="hidden lg:block lg:w-[70%] xl:w-3/4 xxl:w-4/5 bg-dark rounded-xl p-7 xxl:px-14">
          <EditUserForm
            profile={props.profile}
            statusOptions={props.statusOptions}
          />
        </div>
      </div>
    </main>
  );
}
export default ProfileView;
