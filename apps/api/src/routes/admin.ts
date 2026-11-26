import express from 'express';
import authHandler from "../middleware/authHandler.js";
import * as productController from "../controllers/store/productController.js";

const adminRouter = express.Router();

// All admin endpoints require the HttpOnly session cookie issued by /auth/v1/login.
adminRouter.use(authHandler);
adminRouter.get("/products", productController.list);

export default adminRouter;