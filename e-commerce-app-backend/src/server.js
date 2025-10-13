import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { sanitizeMiddleware } from "./middlewares/sanitizeMiddleware.js";

export const startServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 5000;

  await connectDB();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(apiLimiter);
  app.use(sanitizeMiddleware);

  app.use("/api", routes);

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};
