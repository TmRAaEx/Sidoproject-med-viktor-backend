// src/routes/index.ts

import { Router, Request, Response } from "express";
import userRoutes from "./users";
import authRoutes from "./authRoutes"

const baseRoutes = Router();

baseRoutes.get("/", (req: Request, res: Response) => {
  res.send("Express + typescript");
});

baseRoutes.use("/api/users", userRoutes);
baseRoutes.use("/authentication", authRoutes);

export default baseRoutes;
