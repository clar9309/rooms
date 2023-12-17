import { z } from "zod";

export const reply = z.enum(["pending", "accepted", "declined"]);
