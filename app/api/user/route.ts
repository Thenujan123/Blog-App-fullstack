import { UserSchema } from "@/Schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { handleError } from "../helpers/handleError";
import generateToken from "../helpers/generateToken";
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = UserSchema.parse(body);
    const hashedPassword = await hash(validatedData.password, 10);
    const isUserExist = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (isUserExist) {
      return NextResponse.json(
        {
          succes: false,
          code: "USER-DUPLICATED",
          message: "EMAIL ALREADY EXIST",
        },
        { status: 409 }
      );
    }
    const newUSer = await prisma.user.create({
      data: { ...validatedData, password: hashedPassword },
    });
    const token = generateToken(newUSer.id);
    return NextResponse.json(
      {
        succes: true,
        newUSer,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError({ error, defaultErr: "FAILED TO CREATE USER" });
  }
};
export const GET = async (req: NextRequest) => {
  try {
    const [allUsers, count] = await prisma.$transaction([
      prisma.user.findMany({
        omit: { password: true, createdAt: true, updatedAt: true },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json(
      {
        success: true,
        allUsers,
        count,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError({ error, defaultErr: "FAILED TO GET ALL USERS" });
  }
};
