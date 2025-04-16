import { NextRequest } from "next/server";
import { z } from "zod";

const defaultSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0 && !isNaN(val), {
      message: "page is Positive Number",
    }),
  size: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 25))
    .refine((val) => val > 0 && !isNaN(val), {
      message: "size is Positive Number",
    }),
});
type PaginationParams = {
  req: NextRequest;
  schema?: any;
  pageKey?: string;
  sizeKey?: string;
};
type ReturnType = {
  page: number;
  size: number;
};
const getPaginationParams = ({
  req,
  schema,
  pageKey = "page",
  sizeKey = "size",
}: PaginationParams): ReturnType => {
  const RowParams = {
    page: req.nextUrl.searchParams.get(pageKey) ?? "",
    size: req.nextUrl.searchParams.get(sizeKey) ?? "",
  };
  const SchemaToBeUsed = schema ?? defaultSchema;
  const { page, size } = SchemaToBeUsed.parse(RowParams);
  return { page, size };
};
export default getPaginationParams;
