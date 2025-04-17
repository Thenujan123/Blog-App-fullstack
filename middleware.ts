import { NextRequest, NextResponse } from "next/server";
import { CookieKey } from "./app/config/cookie.key";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
export const middleware = async (request: NextRequest) => {
  try {
    const token = (await cookies()).get(CookieKey.COOKIE_KEY)?.value;
    let isSessionValid = false;
    const url = request.nextUrl.pathname;
    const secret = new TextEncoder().encode(process?.env?.JWT_SECRET!);

    if (token) {
      const payload = (await jwtVerify(token, secret)).payload;
      isSessionValid = payload ? true : false;
      console.log({ payload });
    }

    const onlyPublicRoutes = ["/register", "forgot-password", "reset-password"];

    if (!isSessionValid && !onlyPublicRoutes.includes(url)) {
      let url = "/register";
      url += `?redirect_to=${request.nextUrl.pathname}`;
      return NextResponse.redirect(new URL(url, request.url));
    }

    if (isSessionValid && onlyPublicRoutes.includes(url)) {
      let url = "/";
      return NextResponse.redirect(new URL(url, request.url));
    }

    if (
      isSessionValid &&
      !onlyPublicRoutes.includes(request.nextUrl.pathname)
    ) {
      NextResponse.next();
    }
  } catch (error) {
    (await cookies()).delete(CookieKey.COOKIE_KEY);
    return NextResponse.redirect(new URL("/login", request.url));
  }
};

export const config = {
  matcher: ["/admin/:paths*", "/register/:paths*"],
};
