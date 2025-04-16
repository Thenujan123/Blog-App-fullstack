import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createBlog = async (data: Prisma.BlogCreateArgs) => {
  await prisma.blog.create(data);
};

export const getBlogs = async () => {
  await prisma.blog.findMany({});
};
