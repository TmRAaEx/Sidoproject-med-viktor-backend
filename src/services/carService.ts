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

export const getCarsBySearch = async (searchTerm: string): Promise<ICar[]> => {
  return Car.find({ name: { $regex: searchTerm, $options: "i" } });
};

export const saveCarsToDB = async () => {
  try {
    // 1️⃣ Fetch cars from Lecab
    const convertedCars = await fetchAndConvertLecabData();
    const lecabCarSKUs = new Set(convertedCars.map((car) => car.sku)); // Store SKUs in a Set for quick lookup

    // 2️⃣ Fetch all cars currently in the database
    const existingCars = await Car.find();

    const updatePromises: any[] = [];
    const insertPromises: any[] = [];
    const deletePromises: any[] = [];

    // 3️⃣ Process each car to determine if it needs to be inserted or updated
    for (const car of convertedCars) {
      const existingCar = existingCars.find((dbCar) => dbCar.sku === car.sku);

      if (existingCar) {
        // 4️⃣ Update the car if it exists
        updatePromises.push(Car.updateOne({ sku: car.sku }, { $set: car }));
        console.log(`[Database]: Car updated - SKU: ${car.sku}`);
      } else {
        // 5️⃣ Insert new car if it doesn't exist
        insertPromises.push(Car.create(car));
        console.log(`[Database]: Car created - SKU: ${car.sku}`);
      }
    }

    // 6️⃣ Perform batch updates and inserts
    await Promise.all(updatePromises);
    await Promise.all(insertPromises);

    // 7️⃣ Identify and delete cars that no longer exist on Lecab
    for (const dbCar of existingCars) {
      if (!lecabCarSKUs.has(dbCar.sku)) {
        deletePromises.push(Car.deleteOne({ sku: dbCar.sku }));
        console.log(`[Database]: Car removed - SKU: ${dbCar.sku}`);
      }
    }

    // 8️⃣ Perform batch delete
    await Promise.all(deletePromises);

    console.log("[Database]: Sync complete");
  } catch (error) {
    console.error("[Database]: Error during syncing process", error);
  }
};
