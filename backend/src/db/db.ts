import mongoose from "mongoose";

import { DB_NAME } from "../constants";
import logger from "../utils/logger";

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${DB_NAME}`,
      {
        writeConcern: { w: "majority" },
      },
    );
    logger.info(
      `MongoDB connected - DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    logger.error("MONGODB connection error: ");
    throw error;
  }
}

export default connectDB;
