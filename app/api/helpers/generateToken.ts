import { sign } from "jsonwebtoken";

const generateToken = (id: string) => {
  try {
    const token = sign({ id }, process.env.JWT_SECRET!, { expiresIn: "10m" });
    return token;
  } catch (error) {
    throw {
      code: "TOKEN-GENERATED-ERROR",
      message: "TOKEN THAT IS GENERATED IS FAILED",
    };
  }
};
export default generateToken;
