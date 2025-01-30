//src/controllers/carController.ts

import { Request, Response } from "express";
import * as carService from "@services/carService";

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
