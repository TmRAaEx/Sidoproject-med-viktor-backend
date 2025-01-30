// src/routes/users/GET.ts
import { getUserById } from "@controllers/userController";
import express, { Request, Response } from "express";

const router = express.Router();

// Example: Get all users
router.get("/", (req: Request, res: Response) => {
  res.send("Getting all users");
});

// Example: Get a user by ID
router.get("/:id", getUserById);

export default router;
