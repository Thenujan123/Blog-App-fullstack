import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { CookieKey } from "@/app/config/cookie.key";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(CookieKey.COOKIE_KEY) ?? "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 404) {
      console.log("USER NOT AUTHORIZED");
    }
  }
);
export default api;
