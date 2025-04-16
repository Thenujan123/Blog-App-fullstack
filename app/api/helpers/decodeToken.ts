import { decode, JwtPayload } from "jsonwebtoken";

export const decodeToken = (token: string) => {
  try {
    const dct = decode(token);
    return dct as JwtPayload & { id: string };
  } catch (error) {}
};
