import prisma from "@/lib/prisma";
import { BlogSchema } from "@/Schemas/blog.schema";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../helpers/handleError";
import getPaginationParams from "../helpers/getPaginationParams";
import { title } from "process";

export const POST = async (req: NextRequest) => {
  try {
    const userID = req.nextUrl.searchParams.get("uid") || "";
    const body = await req.json();
    const validatedData = BlogSchema.parse(body);
    const isSlugExist = await prisma.blog.findUnique({
      where: { slug: validatedData.slug },
    });
    if (isSlugExist) {
      return NextResponse.json(
        {
          success: false,
          code: "SLUG-DUPLICATED",
          message: "SLUG-ALREADY-EXIST",
        },
        { status: 409 }
      );
    }
    const newBlog = await prisma.blog.create({
      data: {
        author: {
          connect: {
            id: userID,
          },
        },
        ...validatedData,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return NextResponse.json(
      {
        success: true,
        newBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError({ error, defaultErr: "FAILED TO CREATE BLOG" });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const search = req.nextUrl.searchParams.get("search");
    const searchText = search
      ? {
          OR: [
            {
              title: {
                contains: search,
              },
            },
            {
              content: {
                contains: search,
              },
            },
          ],
        }
      : {};
    const { page, size } = getPaginationParams({ req });
    const [allBlogs, count] = await prisma.$transaction([
      prisma.blog.findMany({
        where: searchText,
        omit: { createdAt: true, updatedAt: true },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.blog.count(),
    ]);
    return NextResponse.json({
      success: true,
      allBlogs,
      count,
    });
  } catch (error) {
    return handleError({ error, defaultErr: "FAILED TO GET ALL BLOGS" });
  }
};
