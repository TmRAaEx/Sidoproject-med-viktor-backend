//src/controllers/carController.ts

import { Request, Response } from "express";
import * as carService from "@services/carService";

export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 10; // Default limit to 10 if not provided
    const page = Number(req.query.page) || 1; // Default page to 1 if not provided
    const sortBy = req.query.sortBy as string;
    const order = req.query.order === "asc" ? 1 : -1; // Default to descending

    // Construct sorting object
    const sortObject: Record<string, 1 | -1> = sortBy
      ? { [sortBy]: order as 1 | -1 }
      : { createdAt: -1 }; //default sort is createdAt descending

    // Fetch cars with sorting and pagination
    const cars = await carService.getCars(limit, sortObject, page);

    if (!cars || cars.length === 0) {
      res.status(404).json({ message: "No cars found" });
      return;
    }

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: (error as Error).message,
    });
  }
};
export const getCarById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const carId = req.params.id;
    const car = await carService.getCarById(carId);

    if (!car) {
      res.status(404).json({ message: "Car not found!" });
      return;
    }

    res.status(200).json(car);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};
