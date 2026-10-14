import * as authController from "../controllers/authController.js";
import * as productController from "../controllers/productController.js";
import adminRouter from "./admin.js";
import authHandler from "../middleware/authHandler.js";
import {authLimiter} from "../middleware/rateLimiters.js";
import healthRouter from "./health.js";

//import {upload, uploadImage} from './controllers/uploadController.js';

export function registerRoutes(app) {
    // Public API
    app.get('/api/products', productController.list);
    // app.get('/api/products/:productId', shopController.get);
    // app.post('/api/orders', shopController.create);
    // app.post('/api/contacts', shopController.createContact);

    // Auth

    app.post('/auth/login', authLimiter, authController.login);
    app.get('/auth/validation', authHandler, (req, res) => {
        return res.status(200).json('ok');
    });

    // // api
    // app.use('/api', adminRouter);


    // HealthCheck
    app.use('/health', healthRouter);
}
