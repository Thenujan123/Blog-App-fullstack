import { z } from "zod";

const BlogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  content: z
    .string()
    .min(100, { message: "Content must be at least 100 characters long" }),
});

export { BlogSchema };
