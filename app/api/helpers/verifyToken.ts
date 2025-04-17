import { verify } from "jsonwebtoken";

export const verifyToken = (token: string) => {
  try {
    verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    const err = error as any;

    if (err.name === "TokenExpiredError") {
      throw {
        code: "TOKEN_EXPIRED",
        message: "TOKEN THAT YOU HAVE PROVIDED IS EXPIRED",
      };
    }
    if (err.name === "JsonWebTokenError") {
      throw {
        code: "TOKEN_INVALID",
        message: "TOKEN THAT YOU HAVE PROVIDED IS INVALID",
      };
    }
    console.log("Error Name:" + err.name);
  }
};
