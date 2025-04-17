import { z } from "zod";
import { UserSchema } from "@/Schemas/user.schema";
export type UserType = z.infer<typeof UserSchema>;
