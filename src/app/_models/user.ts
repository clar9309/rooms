import { Avatar, Status, User } from "@prisma/client";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserSignupForm extends UserCredentials {
  first_name: string;
  last_name: string;
  password_confirm: string;
  birthday: string;
}

interface UserEditBase {
  first_name: string;
  last_name: string;
  birthday: string;
  full_status?: { id: string; title: string };
  status: string;
}
export interface UserEditForm extends UserEditBase {
  avatar_img: string | Blob;
}
export interface UserEdit extends UserEditBase {
  avatar: Avatar | null;
}
export interface UserId {
  user_id: string;
}

export interface ExtendedUser extends User {
  avatar?: Avatar | null;
  status?: Status;
}
