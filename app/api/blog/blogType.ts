import { BlogSchema } from "@/Schemas/blog.schema";
import { z } from "zod";

export type BlogType = {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    firstName: string;
    lastName: string;
  };
};

export type BlogReolverType = z.infer<typeof BlogSchema>;
