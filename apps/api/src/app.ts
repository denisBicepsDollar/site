import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "@/middleware/errorHandler";
import { registerRoutes } from "@/routes/routes";
import { apiLimiter } from "@/middleware/rateLimiters";
import { ApiError } from "@/utils/ApiError";
import { requestContext } from "@/middleware/requestContext";
import { accessLogger } from "@/middleware/accessLogger";
import { adminProductImageDirectory } from "@/controllers/admin/productImagesController.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:3001",
        "http://127.0.0.1:5173",
      ],
      credentials: true,
    }),
  );
  app.use(accessLogger);

  app.use(requestContext);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads/admin-products", express.static(adminProductImageDirectory, { immutable: true, maxAge: "1y" }));
  app.use(cookieParser());

  app.use("/api/", apiLimiter);

  registerRoutes(app);

  app.use(() => {
    throw new ApiError(404);
  });

  app.use(errorHandler);

  return app;
}
