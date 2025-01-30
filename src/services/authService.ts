//src/services/authService

import jwt from 'jsonwebtoken';
import {getUserByEmail} from "@services/userService";
import {IUser} from "@interfaces/Iuser";

export const login = async (email: string, password: string): Promise<string> => {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("User not found!");
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Credentials are not match!");
    return user._id
}

