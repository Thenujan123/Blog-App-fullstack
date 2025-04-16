import { NextResponse } from "next/server";
import { z } from "zod";

export const handleError = ({
  error,
  defaultErr,
}: {
  error: any;
  defaultErr: string;
}) => {
  console.log(error);
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        code: "400",
        message: "VALIDATION FAILED",
        errorMessage: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }
  return NextResponse.json(
    {
      success: false,
      message: "INTERNAL SERVER ERROR" + defaultErr,
    },
    { status: 500 }
  );
};
