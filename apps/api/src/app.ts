import express from "express";
import path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "@/middleware/errorHandler";
import { registerRoutes } from "@/routes/routes";
import { apiLimiter } from "@/middleware/rateLimiters";
import { ApiError } from "@/utils/ApiError";
import { requestContext } from "@/middleware/requestContext";
import { accessLogger } from "@/middleware/accessLogger";
import { adminProductImageDirectory } from "@/controllers/admin/productImagesController.js";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3001",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:3001",
]);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const { hostname, protocol } = new URL(origin);
    if (
      (protocol === "http:" || protocol === "https:") &&
      (hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".e2b.app"))
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin(origin, callback) {
        callback(null, isAllowedOrigin(origin));
      },
      credentials: true,
    }),
  );
  app.use(accessLogger);

  app.use(requestContext);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    "/uploads/admin-products",
    express.static(adminProductImageDirectory, { immutable: true, maxAge: "1y" }),
  );
  const legacyUploadDirectory = path.resolve("uploads/admin-products");
  if (legacyUploadDirectory !== adminProductImageDirectory) {
    app.use(
      "/uploads/admin-products",
      express.static(legacyUploadDirectory, { immutable: true, maxAge: "1y" }),
    );
  }
  app.use(cookieParser());

  app.use("/api/", apiLimiter);

  registerRoutes(app);

  app.use(() => {
    throw new ApiError(404);
  });

  app.use(errorHandler);

  return app;
}
