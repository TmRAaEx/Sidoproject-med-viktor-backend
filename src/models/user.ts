//src/models/user

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "@interfaces/Iuser";

// Define the schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Simple regex for email
        },
        message: (props: mongoose.ValidatorProps) =>
          `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v); // Example password regex (min 8 chars, 1 letter, 1 number)
        },
        message: (props: mongoose.ValidatorProps) =>
          `Password must be at least 8 characters long and contain both letters and numbers.`,
      },
    },

    isConfirmedEmail: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Add instance methods if needed
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
