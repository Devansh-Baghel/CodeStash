import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN!],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet());

// Routes
import healthCheckRouter from "./routes/healthCheck.routes";
import userRouter from "./routes/user.routes";

app.use("/api", healthCheckRouter);
app.use("/api/users", userRouter);

export default app;
