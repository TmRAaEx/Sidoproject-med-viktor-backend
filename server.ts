// server.ts
import dotenv from "dotenv";
import { app } from "./src/app";
import DBconnection from "@config/dbConfig";
dotenv.config();

const port = process.env.PORT || 3000;

//connect to database
DBconnection();

const url =
  "https://store.lecab.se/_next/image?url=https%3A%2F%2Fassets.store.lecab.se%2Fimages%2Fproducts%2FXUP02E%2FXUP02ED.jpg%3Fv%3D1738053005134&w=1920&q=75";
const decodedUrl = decodeURIComponent(url);

console.log("urlo", decodedUrl);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
  