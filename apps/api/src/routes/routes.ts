import * as authController from "@/controllers/authController";
import * as orderController from "@/controllers/store/orderController";
import * as productController from "@/controllers/store/productController";
import * as contactController from "@/controllers/contactController";
import authHandler from "@/middleware/authHandler";
import { authLimiter } from "@/middleware/rateLimiters";
import healthRouter from "./health";
import adminRouter from "./admin";

export function registerRoutes(app) {
  // Public API
  app.get("/api/v1/products", productController.list);
  app.get("/api/v1/products/labels", productController.getLabels);
  app.get("/api/v1/products/variants/by-ids", productController.getVariants);
  app.get("/api/v1/products/:slug", productController.getOneProduct);
  app.post("/api/v1/orders", orderController.create);
  app.post("/api/v1/contacts", contactController.create);

  // Authenticated admin API
  app.use("/api/v1/admin", adminRouter);

  // Auth
  app.post("/auth/v1/login", authLimiter, authController.login);
  app.post("/auth/v1/logout", authController.logout);
  app.get("/auth/v1/validation", authHandler, (req, res) => {
    return res.status(200).json("ok");
  });

  // HealthCheck
  app.use("/health", healthRouter);
}
