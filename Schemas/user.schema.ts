import { z } from "zod";

const UserSchema = z.object({
  firstName: z
    .string()
    .min(5, { message: "First name must be at least 5 characters long" }),
  lastName: z
    .string()
    .min(5, { message: "Last name must be at least 5 characters long" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});
export { UserSchema };
