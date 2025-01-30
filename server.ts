// server.ts
import dotenv from "dotenv";
import { app } from "./src/app";
import DBconnection from "@config/dbConfig";
dotenv.config();


const port = process.env.PORT || 3000;

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
//connect to database
DBconnection();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
  