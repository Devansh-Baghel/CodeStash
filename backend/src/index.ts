import dotenv from 'dotenv';

import app from './app';
import { PORT } from './constants';
import connectDB from './db/db';
import logger from './utils/logger';

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
    logger.error("MongoDB Connection failed !!!");
    throw err;
  });
