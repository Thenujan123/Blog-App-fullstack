import { NextRequest, NextResponse } from "next/server";
import privateRoute from "../../helpers/privateRoute";
import prisma from "@/lib/prisma";
import { handleError } from "../../helpers/handleError";

export const DELETE = async (req: NextRequest) => {
  try {
    return await privateRoute(async (user) => {
      const userId = user.id;
      if (userId) {
        const url = req.url;
        const id = url.split("blog/")[1];
        await prisma.blog.delete({ where: { id: id } });
        return NextResponse.json(
          { message: "Blog Deleted successfully" },
          { status: 201 }
        );
      }
      return NextResponse.json(
        { message: "something error occure in blog delete" },
        { status: 400 }
      );
    });
  } catch (error) {
    return handleError({ error, defaultErr: "Errocu in deleting Blog" });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    return await privateRoute(async (user) => {
      const userId = user.id;
      if (userId) {
        const url = req.url;
        const id = url.split("blog/")[1];
        console.log("ID IS:" + id);

        const body = await req.json();
        const updatedBlog = await prisma.blog.update({
          where: { id: id },
          data: body,
        });
        return NextResponse.json(
          { message: "POST Updated", updatedBlog },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: "Someting Error Ocure in updation" },
        { status: 400 }
      );
    });
  } catch (error) {
    return handleError({ error, defaultErr: "Errocu in Updating Blog" });
  }
};
