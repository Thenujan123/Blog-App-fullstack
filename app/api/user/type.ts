import { z } from "zod";
import { UserSchema } from "@/Schemas/user.schema";
export type UserType = z.infer<typeof UserSchema>;

export type UserResponse = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  token: string;
};
