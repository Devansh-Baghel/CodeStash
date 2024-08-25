import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
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
import commentRouter from "./routes/comment.routes";
import communityRouter from "./routes/community.routes";
import healthCheckRouter from "./routes/healthCheck.routes";
import postRouter from "./routes/post.routes";
import userRouter from "./routes/user.routes";

app.use("/api", healthCheckRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/community", communityRouter);

export default app;
