//src/routes/cars/index.ts
import express from "express";
import getRoutes from "./GET";

const carRoutes = express.Router();


// Mounting each set of routes for the respective HTTP methods
carRoutes.use('/', getRoutes);  // All GET requests


export default carRoutes;