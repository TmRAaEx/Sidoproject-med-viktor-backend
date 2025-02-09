// src/routes/cars/GET.ts
import { getCarById, getCars, getCarsBySearch } from "@controllers/carController";
import express from "express";

const router = express.Router();

// Example: Get all Cars
router.get("/", getCars);

// Example: Get a  by ID
router.get("/:id", getCarById);


router.get("/search", getCarsBySearch);

export default router;
