// src/routes/cars/GET.ts
import { getCarById } from "@controllers/carController";
import express, { Request, Response } from "express";

const router = express.Router();

// Example: Get all Cars
router.get("/", (req: Request, res: Response) => {
    res.send("Getting all Cars");
});

// Example: Get a  by ID
router.get("/:id", getCarById);

export default router;
