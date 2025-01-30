// src/services/userService.ts
import User from "@models/user";
import { IUser } from "@interfaces/Iuser";

export const getUserById = async (userID: string): Promise<IUser | null> => {
  return User.findById(userID);
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({email});
};


export const createUser = async (userData: IUser): Promise<IUser> => {
    
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw new Error("Email already in use!");
  }

  const user = new User(userData);
  return await user.save();
};
