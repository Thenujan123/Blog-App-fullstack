"use client";
import { Button, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogSchema } from "@/Schemas/blog.schema";
import { BlogReolverType } from "@/app/api/blog/blogType";
import { useMutation } from "@tanstack/react-query";
import api from "@/app/api/helpers/baseApi";
import { toast } from "react-toastify";
import queryClient from "@/app/components/queryClient";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const CreateBlogPage = () => {
  const router = useRouter();
  const CreateBlog = async (FormData: {
    title: string;
    content: string;
    slug: string;
  }) => {
    await api.post("blog", FormData);
  };

  const { mutateAsync: createBlog, isPending } = useMutation({
    mutationFn: CreateBlog,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-posts"] });
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<BlogReolverType>({
    mode: "onTouched",
    resolver: zodResolver(BlogSchema),
  });
  if (isPending) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="w-full h-dvh flex items-center justify-center bg-slate-300">
      <form
        className="rounded w-[60%] h-[70%] bg-slate-100 p-10 flex flex-col gap-8"
        onSubmit={handleSubmit(async (FormDatas) => {
          await createBlog(FormDatas);
          reset();
          toast.success("Blog Created !", {
            position: "top-right",
          });
          router.push("/");
        })}
      >
        <h1 className="text-center text-3xl capitalize font-bold">
          Create Blog
        </h1>
        <div className="w-[80%] mx-auto container flex flex-col gap-6">
          <TextField
            label={"Title"}
            fullWidth
            size="small"
            {...register("title")}
            helperText={errors.title?.message}
            error={!!errors.title?.message}
          />
          <TextField
            label={"slug"}
            fullWidth
            size="small"
            {...register("slug")}
            helperText={errors.slug?.message}
            error={!!errors.slug?.message}
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            size="small"
            {...register("content")}
            helperText={errors.content?.message}
            error={!!errors.content?.message}
          />

          <Button type="submit" variant="contained" fullWidth>
            Create Blog
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPage;
