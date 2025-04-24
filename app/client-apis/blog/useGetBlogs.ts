"use client";
import { useQuery } from "@tanstack/react-query";

import api from "@/app/api/helpers/baseApi";
import { BlogType } from "@/app/api/blog/blogType";
import { PaginationParams } from "@/app/components/type";

// Custom hook for useQuery
export const useGetAllPosts = (params: PaginationParams) => {
  // API call function
  const fetchAllPosts = async (): Promise<{
    allBlogs: BlogType[];
    count: number;
  }> => {
    const response = await api.get("blog", { params: params });
    return response.data;
  };

  return useQuery({
    queryKey: ["get-all-posts", params],
    queryFn: fetchAllPosts, // useQuery expects a function reference, not a promise.
  });
};
