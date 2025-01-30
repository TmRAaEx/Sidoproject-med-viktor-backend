// src/app.ts
import express, { Express } from "express";
import baseRoutes from "@routes/index";

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes  
app.use("/", baseRoutes);
