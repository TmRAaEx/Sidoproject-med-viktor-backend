//src/services/carService.ts

import Car from "@models/car";
import { ICar } from "@interfaces/Icar";

export const getCarById = async (carId: string): Promise<ICar | null> => {
    return Car.findById(carId)
}

