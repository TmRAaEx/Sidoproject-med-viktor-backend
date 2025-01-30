//src/interfaces/Iuser

import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  isConfirmedEmail?: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
