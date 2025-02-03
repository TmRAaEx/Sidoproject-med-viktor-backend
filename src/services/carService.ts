//src/services/carService.ts

import Car from "@models/car";
import { ICar } from "@interfaces/Icar";
import {fetchAndConvertLecabData} from "@services/lecabService"

export const getCarById = async (carId: string): Promise<ICar | null> => {
    return Car.findById(carId)
}

export const saveCarsToDB = async () => {
    const convertedCars = await fetchAndConvertLecabData();
    for (const car of convertedCars) {
        const existingCar = await Car.find({sku: car.sku, id: car.id})
        if (existingCar.length > 0) {
            console.log("Car already exists", existingCar)
            continue;
        }
        const newCar = await Car.create(car);
        console.log("Car created: ", newCar);
    }
}