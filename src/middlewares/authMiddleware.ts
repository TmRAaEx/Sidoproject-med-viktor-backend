import { Request, Response, NextFunction } from "express";

// Middleware to check if the user is logged in (i.e., session exists)
export const authenticateCookie = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
         res.status(401).json({ message: "Not authorized. Please log in." });
        return;
    }
    next(); // Proceed to the next middleware or route handler
};