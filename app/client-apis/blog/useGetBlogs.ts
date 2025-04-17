"use client";
import { useQuery } from "@tanstack/react-query";
import { Blog } from "@prisma/client";
import api from "@/app/api/helpers/baseApi";

// API call function
const fetchAllPosts = async (): Promise<{
  allBlogs: BlogType[];
  count: number;
}> => {
  const response = await api.get("blog");
  return response.data;
};

// Custom hook for useQuery
export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["get-all-posts"],
    queryFn: fetchAllPosts, // useQuery expects a function reference, not a promise.
  });
};
