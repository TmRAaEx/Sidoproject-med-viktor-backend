import express from "express";
import { loginUser } from "@controllers/authController";
import { authenticateCookie } from "@middlewares/authMiddleware";
import {createUser} from "@controllers/userController";

const router = express.Router();

// Public route (No authentication required)
router.post("/register", createUser);
router.post("/login", loginUser);

// Protected route (Authentication required)
router.get("/profile", authenticateCookie, (req, res) => {
    // If the user is authenticated, this will be accessible
    res.json({ message: "Welcome to your profile", userId: req.session.userId });
});

export default router;