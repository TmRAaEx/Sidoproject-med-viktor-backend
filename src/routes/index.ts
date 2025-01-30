// src/routes/index.ts

import { Router, Request, Response } from "express";
import userRoutes from "./users";

const baseRoutes = Router();

baseRoutes.get("/", (req: Request, res: Response) => {
  res.send("Express + typescript");
});

baseRoutes.use("/api/users", userRoutes);

export default baseRoutes;
