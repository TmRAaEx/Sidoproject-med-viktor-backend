// src/routes/users/POST.ts

import { Router } from "express";
import { createUser } from "@controllers/userController";

const router = Router();

router.post("/", createUser);

export default router;
