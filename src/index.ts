// server.ts
import dotenv from "dotenv";
import { app } from "./app";
import { saveCarsToDB } from "@services/carService";
dotenv.config();

const port = process.env.PORT || 3000;

const updateCars = async () => {
  await saveCarsToDB();
};

updateCars();


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
