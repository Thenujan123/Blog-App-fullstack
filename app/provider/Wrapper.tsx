"use client";
import React, { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../components//queryClient.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Wrapper;
