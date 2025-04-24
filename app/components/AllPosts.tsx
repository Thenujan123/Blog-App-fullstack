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
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationParams } from "./type";
import { useMutation } from "@tanstack/react-query";
import api from "../api/helpers/baseApi";
import { toast } from "react-toastify";
import queryClient from "./queryClient";
import useThemeStore from "../store/themeStore";
import { dark } from "@mui/material/styles/createPalette";
const AllPosts = () => {
  const [searchInput, setSearchInput] = useState("");
  const searchParams = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300); // waits 300ms after typing stops

    return () => clearTimeout(timer); // clear previous timer on each new keystroke
  }, [searchInput]);

  const options = useMemo<PaginationParams>(() => {
    return {
      search: debouncedSearch,
      page: parseInt(searchParams.get("page") || "1"),
      size: parseInt(searchParams.get("size") || "25"),
    };
  }, [debouncedSearch]);

  const [light, setLight] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    action: { setMode },
    state: { mode },
  } = useThemeStore();

  useEffect(() => {
    const token = Cookie.get(CookieKey.COOKIE_KEY);
    setIsAuthenticated(!!token);
  }, []);

  const DeletePost = async (id: string) => {
    await api.delete(`blog/${id}`);
    toast.error("Post Deletd Successfully.");
  };
  const { mutateAsync } = useMutation({
    mutationFn: DeletePost,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-posts"] });
    },
  });
  const DeleteBlog = (id: string) => {
    const isConfirm = window.confirm("Sure? Do you Wnat to Delete The Blog?");
    if (isConfirm) {
      mutateAsync(id);
    }
  };
  const { data: blogs, isLoading: BlogLoading } = useGetAllPosts(options);
  const numberOfPages = useMemo<number>(() => {
    const size = parseInt(searchParams.get("page") || "25", 10);
    const count = blogs?.count || 0;
    return Math.ceil(count / size);
  }, [searchParams, blogs]);
  if (BlogLoading) {
    return (
      <div className="h-[90vh] w-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }
  const logOut = () => {
    Cookie.remove(CookieKey.COOKIE_KEY);
  };

  return (
    <div
      className={`w-full h-fit bg-slate-400 flex justify-center items-center ${mode} dark:bg-blue-950`}
    >
      <div
        className={`h-fit w-[70%] bg-100 mx-auto container bg-slate-200 p-5 rounded ${dark} dark:bg-blue-900 `}
      >
        <div
          className={` flex justify-between p-6 bg-slate-500 ${mode} dark:bg-gray-950 `}
        >
          <h1 className="text-white cursor-pointer">
            {light ? (
              <FiSun
                className="text-3xl text-yellow-400"
                onClick={() => {
                  setLight(false);
                  setMode("dark");
                }}
              />
            ) : (
              <FiMoon
                className="text-3xl text-blue-900"
                onClick={() => {
                  setLight(true);
                  setMode("light");
                }}
              />
            )}
          </h1>
          <Search searchInput={searchInput} setSearchInput={setSearchInput} />
          <div>
            {isAuthenticated ? (
              <div className="flex flex-col gap-1">
                <Link href="/admin/create" className="text-white text-2xl">
                  Create New
                </Link>
                <button
                  className="text-white cursor-pointer font-bold"
                  type="button"
                  onClick={() => logOut()}
                >
                  Logout
                </button>
              </div>
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
        <div
          className={`p-10 h-[100%] rounded flex flex-col gap-10 shadow  overflow-auto dark:bg-blue-950`}
        >
          {blogs &&
            blogs.count > 0 &&
            blogs.allBlogs.map((blog) => (
              <li
                key={blog.id}
                className={`bg-slate-50 p-6 rounded list-none flex flex-col gap-4 dark:bg-slate-900 dark:text-white`}
              >
                <p>
                  posted by:{" "}
                  <span className={`font-bold dark:text-white`}>
                    {blog.author.firstName}
                  </span>{" "}
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
                  <Button
                    className="w-[40%]"
                    variant="contained"
                    color="error"
                    onClick={() => DeleteBlog(blog.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
        </div>

        <div
          className={`w-[80%] mx-auto flex justify-between dark:bg-blue-950 dark:text-white`}
        >
          <div className="flex gap-3">
            {Array.from(Array(numberOfPages).keys()).map((i) => (
              <Link
                key={i}
                href={`?page=${i + 1}&size=${searchParams.get("size") || "25"}`}
                className="p-3 bg-indigo-800 text-white rounded cursor-pointer dark:bg-blue-500"
              >
                {i + 1}
              </Link>
            ))}
          </div>
          <div className="border border-indigo-800 p-5 rounded dark:bg-blue-500">
            <select
              name=""
              id=""
              onChange={(e) => {
                const value = e.target.value;
                const newUrl = `?page=${
                  searchParams.get("page") || "1"
                }&size=${value}`;
                router.push(newUrl);
              }}
            >
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
