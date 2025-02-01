//src/routes/authRoutes

import express from "express";
import { loginUser } from "@controllers/authController";
import { authenticateJWT } from "@middlewares/authMiddleware";
import { createUser } from "@controllers/userController";

const router = express.Router();

// Public route (No authentication required)
router.post("/register", createUser);
router.post("/login", loginUser);

// Protected route (Requires JWT authentication)
router.get("/profile", authenticateJWT, (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.json({ message: "Welcome to your profile", userId: req.user.id });
});
export default router;
