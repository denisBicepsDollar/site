import * as shopController from "../controllers/shopController.js";
import * as authController from "../controllers/authController.js";
import adminRouter from "./admin.js";
import authHandler from "../middleware/authHandler.js";

//import {upload, uploadImage} from './controllers/uploadController.js';

export function registerRoutes(app) {
    // Public API
    app.get('/api/products', shopController.list);
    app.get('/api/products/:id', shopController.get);
    app.post('/api/orders', shopController.create);
    app.post('/api/contacts', shopController.createContact);

    // Auth

    app.post('/auth/login', authController.login);
    app.get('/auth/validation', authHandler, (req, res) => {
        return res.status(200).json('ok');
    });

    // Admin
    app.use('/admin', adminRouter);
}
