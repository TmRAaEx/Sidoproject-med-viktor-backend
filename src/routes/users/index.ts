//src/routes/users/index.ts
import express from "express";
import getRoutes from "./GET";
import postRoutes from "./POST"

const userRoutes = express.Router();


// Mounting each set of routes for the respective HTTP methods
userRoutes.use('/', getRoutes);  // All GET requests
userRoutes.use('/',postRoutes)  //All POST requests


export default userRoutes;