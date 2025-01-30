// src/app.ts
import express, { Express } from "express";
import baseRoutes from "@routes/index";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET as string, // Secret key for signing cookies
        resave: false,  // Don't save session if unmodified
        saveUninitialized: false, // Don't create a session until something is stored
        cookie: {
            httpOnly: true, // Make cookie accessible only by the server (not JavaScript)
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
            maxAge: 3600000, // Session expiry time (1 hour)
        },
    })
);
//routes  
app.use("/", baseRoutes);


