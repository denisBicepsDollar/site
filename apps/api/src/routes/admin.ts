import express from 'express';
import authHandler from "../middleware/authHandler.js";
import * as productController from "../controllers/admin/productsController.js";
import { receiveProductImage, uploadProductImage } from "../controllers/admin/productImagesController.js";
import * as orderController from "../controllers/store/orderController.js";

const adminRouter = express.Router();

// All admin endpoints require the HttpOnly session cookie issued by /auth/v1/login.
adminRouter.use(authHandler);
adminRouter.get("/products", productController.list);
adminRouter.post("/products/images", receiveProductImage, uploadProductImage);
adminRouter.post("/products", productController.create);
adminRouter.get("/orders", orderController.listAdmin);
adminRouter.get("/orders/:id", orderController.getAdmin);
adminRouter.patch("/orders/:id/status", orderController.updateAdminStatus);

export default adminRouter;