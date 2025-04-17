"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";
import { useGetAllPosts } from "../client-apis/blog/useGetBlogs";
import { CircularProgress } from "@mui/material";
import Cookie from "js-cookie";
import Link from "next/link";
import { CookieKey } from "../config/cookie.key";
import { FiSun } from "react-icons/fi"; // Feather icons
import { FiMoon } from "react-icons/fi";
import Search from "./Search";

const AllPosts = () => {
  const [searchInput, setSearchInput] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300); // waits 300ms after typing stops

    return () => clearTimeout(timer); // clear previous timer on each new keystroke
  }, [searchInput]);

  const options = useMemo(() => {
    return {
      search: debouncedSearch,
    };
  }, [debouncedSearch]);

  const [light, setLight] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookie.get(CookieKey.COOKIE_KEY);
    setIsAuthenticated(!!token);
  }, []);

  const { data: blogs, isLoading: BlogLoading } = useGetAllPosts(options);

  if (BlogLoading) {
    return (
      <div className="h-[90vh] w-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="w-full h-fit bg-slate-400 flex justify-center items-center">
      <div className="h-fit w-[70%] bg-100 mx-auto container bg-slate-200 p-5 rounded ">
        <div className=" flex justify-between p-6 bg-slate-500 ">
          <h1 className="text-white cursor-pointer">
            {light ? (
              <FiSun className="text-3xl text-yellow-400" />
            ) : (
              <FiMoon className="text-3xl text-blue-900" />
            )}
          </h1>
          <Search searchInput={searchInput} setSearchInput={setSearchInput} />
          <div>
            {isAuthenticated ? (
              <Link href="/admin/create text-white text-2xl">Create New</Link>
            ) : (
              <Link
                href="/register"
                className="text-blue-700 text-2xl hover:underline"
              >
                Register
              </Link>
            )}
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
                  <span className="text-sm">
                    {new Date(blog.createdAt).toLocaleString()}
                  </span>
                </p>
                <h1 className="text-2xl font-bold capitalize">{blog.title}</h1>
                <p className="text-ellipsis">{blog.content}</p>
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
