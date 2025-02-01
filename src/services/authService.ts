//src/services/authService

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserByEmail } from "@services/userService";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // Ensure it's always a string

if (!JWT_SECRET) {
  console.error("[server]: JWT_SECRET is not in environment variables");
  throw new Error("Internal server error!");
}

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found!");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials!");

  // Generate JWT with correct types
  const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};
