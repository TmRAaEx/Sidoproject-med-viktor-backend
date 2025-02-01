//src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  console.error("[server]: JWT_SECRET is not in environment variables");
  throw new Error("Internal server error!");
}

// Extend Express Request type to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string };
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }; // Ensure it matches `authService.ts`
    req.user = { id: decoded.id }; // Attach user ID to request
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid token" });
    return;
  }
};
