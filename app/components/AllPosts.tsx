"use client";
import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useGetAllPosts } from "../client-apis/blog/useGetBlogs";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
const AllPosts = () => {
  const {
    data: blogs,
    isError: isBlogErr,
    error: BlogErr,
    isLoading: BlogLoading,
  } = useGetAllPosts();

  if (BlogLoading) {
    return (
      <div className="h-[90vh] w-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="w-full h-dvh bg-slate-400 flex justify-center items-center">
      <div className="h-[100%] w-[70%] bg-100 mx-auto container bg-slate-200 p-5 rounded ">
        <div className=" flex justify-between px-3">
          <h1>Dark Mode</h1>
          <h1 className="text-center">search</h1>
          <div>
            <Link href={"/register"}>Register</Link>
          </div>
        </div>
        <div className="p-10 h-[100%] rounded flex flex-col gap-10 shadow  overflow-auto">
          {blogs &&
            blogs.count > 0 &&
            blogs.allBlogs.map((blog) => (
              <li
                key={blog.id}
                className="bg-slate-50 p-6 rounded list-none flex flex-col gap-4"
              >
                <p>
                  posted by:{" "}
                  <span className="font-bold">{blog.author.firstName}</span>{" "}
                </p>
                <p>
                  publised at:{" "}
                  <span className="text-sm">{Date(blog.createdAt)}</span>
                </p>
                <h1 className="text-2xl font-bold capitalize">{blog.title}</h1>
                <p>{blog.content}</p>
                <div className="w-full flex justify-between">
                  <Button className="w-[40%]" variant="contained">
                    Edit
                  </Button>
                  <Button className="w-[40%]" variant="contained" color="error">
                    Delete
                  </Button>
                </div>
              </li>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
