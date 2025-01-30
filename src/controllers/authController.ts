// src/controllers/authController.ts

import {Request, Response} from "express";
import {login} from "@services/authService";

export const loginUser = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user_id = await login(email, password);
        req.session.userId = user_id.toString();
        res.json({message: "Logged in"});
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({error: error.message});
        } else {
            res.status(500).json({error: "Unknown Error!"});
        }
    }
}

