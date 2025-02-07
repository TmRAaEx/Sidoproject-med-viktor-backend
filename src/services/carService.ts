//src/services/carService.ts

import Car from "@models/car";
import { ICar } from "@interfaces/Icar";
import { fetchAndConvertLecabData } from "@services/lecabService";

export const getCarById = async (carId: string): Promise<ICar | null> => {
  return Car.findById(carId);
};

export const getCars = async (
  limit: number,
  sort: Record<string, 1 | -1>,
  page: number
): Promise<ICar[]> => {
  const skip = (page - 1) * limit; // Calculate how many records to skip

  return Car.find().sort(sort).limit(limit).skip(skip); // Implement pagination
};

export const saveCarsToDB = async () => {
  const convertedCars = await fetchAndConvertLecabData();

  for (const car of convertedCars) {
    const existingCar = await Car.findOne({ sku: car.sku, id: car.id });

    if (existingCar) {
      await Car.updateOne({ sku: car.sku, id: car.id }, { $set: car });
      console.log(`[Database]: Car updated - SKU: ${car.sku}, ID: ${car.id}`);
    } else {
      const newCar = await Car.create(car);
      console.log(
        `[Database]: Car created - SKU: ${newCar.sku}, ID: ${newCar.id}`
      );
    }
  }
};
