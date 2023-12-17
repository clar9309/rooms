import { db } from "./prisma-client"; // Corrected import path

//Definined usercre
export type UserCreateInput = Parameters<typeof db.user.create>[0];
