import * as shopController from "../controllers/shopController.js";
import * as authController from "../controllers/authController.js";
import adminRouter from "./admin.js";

//import {upload, uploadImage} from './controllers/uploadController.js';

export function registerRoutes(app) {
    // Public API
    app.get('/api/products', shopController.list);
    app.get('/api/products/:id', shopController.get);
    app.post('/api/orders', shopController.create);
    app.post('/api/contacts', shopController.createContact);

    // Auth

    app.post('/auth/login', authController.login);

    // Admin
    app.use('/admin', adminRouter);
}
