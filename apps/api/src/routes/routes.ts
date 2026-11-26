import * as authController from "@/controllers/authController";
import * as productController from "@/controllers/store/productController";
import adminRouter from "./admin";
import authHandler from "@/middleware/authHandler";
import { authLimiter } from "@/middleware/rateLimiters";
import healthRouter from "./health";
import { getOneProduct } from "@/controllers/store/productController";

//import {upload, uploadImage} from './controllers/uploadController';

export function registerRoutes(app) {
  // Public API
  app.get("/api/v1/products", productController.list);
  app.get("/api/v1/products/labels", productController.getLabels);
  app.get("/api/v1/products/:slug", productController.getOneProduct);
  app.get("/api/v1/products/variants/by-ids", productController.getVariants);

  // app.post('/api/orders', shopController.create);
  // app.post('/api/contacts', shopController.createContact);

  // Auth

  app.post("/auth/v1/login", authLimiter, authController.login);
  app.get("/auth/v1/validation", authHandler, (req, res) => {
    return res.status(200).json("ok");
  });

  // // api
  // app.use('/api', adminRouter);

  // HealthCheck
  app.use("/health", healthRouter);
}
