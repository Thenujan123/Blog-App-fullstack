"use client";
import React from "react";
import { TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserType } from "../api/user/type";
import { UserSchema } from "@/Schemas/user.schema";
import Cookie from "js-cookie";
import api from "../api/helpers/baseApi";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CookieKey } from "../config/cookie.key";
const RegisterPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserType>({
    mode: "onTouched",
    resolver: zodResolver(UserSchema),
  });
  return (
    <div className="h-dvh w-full flex items-center justify-center">
      <form
        className="w-[60%] h-[80%] mx-auto bg-slate-200 shadow-xl rounded pt-10 flex flex-col gap-8"
        onSubmit={handleSubmit(async (FormDatas) => {
          try {
            const { data } = await api.post("user", FormDatas);
            reset();
            toast.success("User Registered Successfull !", {
              position: "top-right",
            });

            Cookie.set(CookieKey.COOKIE_KEY, data.token);
            router.push("/");
          } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const ErrData = err.response?.status;

            console.log("ERROR:", ErrData || "Unknown error");
          }
        })}
      >
        <h1 className="text-center py-3 font-bold text-2xl tracking-tight">
          Register
        </h1>
        <div className="px-7 w-full flex gap-5">
          <TextField
            label="First Name"
            variant="outlined"
            className="w-[50%]"
            size="small"
            {...register("firstName")}
            helperText={errors.firstName?.message}
            error={!!errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            className="w-[50%]"
            size="small"
            {...register("lastName")}
            helperText={errors.lastName?.message}
            error={!!errors.lastName?.message}
          />
        </div>
        <div className="px-7 w-full ">
          <TextField
            label="email"
            variant="outlined"
            fullWidth
            size="small"
            {...register("email")}
            helperText={errors.email?.message}
            error={!!errors.email?.message}
          />
        </div>
        <div className="px-7 w-full">
          <TextField
            label="passwword"
            variant="outlined"
            fullWidth
            type="password"
            size="small"
            {...register("password")}
            helperText={errors.password?.message}
            error={!!errors.password?.message}
          />
        </div>
        <div className="px-7 w-full">
          <Button className="px-7" variant="contained" type="submit" fullWidth>
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
