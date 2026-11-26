import * as authController from "@/controllers/authController";
import * as orderController from "@/controllers/store/orderController";
import * as productController from "@/controllers/store/productController";
import authHandler from "@/middleware/authHandler";
import { authLimiter } from "@/middleware/rateLimiters";
import healthRouter from "./health";

export function registerRoutes(app) {
  // Public API
  app.get("/api/v1/products", productController.list);
  app.get("/api/v1/products/labels", productController.getLabels);
  app.get("/api/v1/products/variants/by-ids", productController.getVariants);
  app.get("/api/v1/products/:slug", productController.getOneProduct);
  app.post("/api/v1/orders", orderController.create);

  // Auth
  app.post("/auth/v1/login", authLimiter, authController.login);
  app.get("/auth/v1/validation", authHandler, (req, res) => {
    return res.status(200).json("ok");
  });

  // HealthCheck
  app.use("/health", healthRouter);
}
