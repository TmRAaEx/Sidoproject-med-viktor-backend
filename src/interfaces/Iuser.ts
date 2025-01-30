//src/interfaces/Iuser

import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isConfirmedEmail?: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
