// src/routes/cars/GET.ts
import { getCarById, getCars } from "@controllers/carController";
import express, { Request, Response } from "express";

const router = express.Router();

// Example: Get all Cars
router.get("/", getCars);

// Example: Get a  by ID
router.get("/:id", getCarById);

export default router;
