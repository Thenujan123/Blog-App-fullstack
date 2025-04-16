import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createUser = async (data: Prisma.UserCreateArgs) => {
  await prisma.user.create(data);
};
export const getUsers = async () => {
  await prisma.user.findMany({});
};
