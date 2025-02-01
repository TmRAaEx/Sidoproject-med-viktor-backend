// src/routes/index.ts

import { Router, Request, Response } from "express";
import userRoutes from "./users";
import authRoutes from "./authRoutes"
import carRoutes from "./cars";

const baseRoutes = Router();

baseRoutes.get("/", (req: Request, res: Response) => {
  res.send("Express + typescript");
});

baseRoutes.use("/api/users", userRoutes);
baseRoutes.use("/auth", authRoutes);
baseRoutes.use("/api/cars", carRoutes);

export default baseRoutes;
