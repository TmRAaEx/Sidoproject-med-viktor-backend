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
  // 1️⃣ Fetch cars from Lecab
  const convertedCars = await fetchAndConvertLecabData();
  const lecabCarSKUs = new Set(convertedCars.map((car) => car.sku)); // Store SKUs in a Set for quick lookup

  // 2️⃣ Fetch all cars currently in the database
  const existingCars = await Car.find();

  for (const car of convertedCars) {
    const existingCar = await Car.findOne({ sku: car.sku });

    if (existingCar) {
      // 3️⃣ Update the car if it exists
      await Car.updateOne({ sku: car.sku }, { $set: car });
      console.log(`[Database]: Car updated - SKU: ${car.sku}`);
    } else {
      // 4️⃣ Insert new car if it doesn't exist
      await Car.create(car);
      console.log(`[Database]: Car created - SKU: ${car.sku}`);
    }
  }

  // 5️⃣ Identify and delete cars that no longer exist on Lecab
  for (const dbCar of existingCars) {
    if (!lecabCarSKUs.has(dbCar.sku)) {
      await Car.deleteOne({ sku: dbCar.sku });
      console.log(`[Database]: Car removed - SKU: ${dbCar.sku}`);
    }
  }
};
