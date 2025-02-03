// src/app.ts
import express, { Express } from "express";
import baseRoutes from "@routes/index";
import dotenv from "dotenv";
import cors from "cors";
import {startCronJobs} from "./tasks";
import DBconnection from "@config/dbConfig";

dotenv.config();


export const app: Express = express();

DBconnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/", baseRoutes);

startCronJobs();
