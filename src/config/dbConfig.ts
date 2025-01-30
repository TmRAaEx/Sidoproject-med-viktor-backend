//src/config/dbConfig

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const DBconnection = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    if (!dbURI) {
      throw new Error(
        "[Database Error]: 'dbURI' is not defined in environment variables"
      );
    }
    const connection = await mongoose.connect(dbURI);
    console.log(`[Database]: MongoDB connected ${connection.connection.host}`);
  } catch (error: any) {
    if (error instanceof Error) {
      console.error(`[Database Error]: ${error.message}`);
    } else {
      console.error("[Database Error]: unknown error");
    }

    process.exit(1);
  }
};

export default DBconnection;
