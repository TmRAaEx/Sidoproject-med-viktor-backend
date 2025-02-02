  // src/controllers/userController.ts
  import { Request, Response } from "express";
  import * as userService from "@services/userService";

  export const getUserById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userID = req.params.id;
      const user = await userService.getUserById(userID);

      if (!user) {
        res.status(404).json({ message: "User not found!" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server error", error: (error as Error).message });
    }
  };

  export const createUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };
