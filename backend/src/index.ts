import dotenv from "dotenv";
import connectDB from "./db/db.ts";
import app from "./app.ts";
import { PORT } from "./constants.ts";
import logger from "./utils/logger.ts";

dotenv.config({
  path: "../.env",
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server Running on Port: ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB Connection failed !!!", err);
  });
