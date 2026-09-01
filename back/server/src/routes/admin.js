import express from 'express';
import * as tableController from "../controllers/tableController.js";
import * as rowController from "../controllers/rowController.js";
import * as reportController from "../controllers/reportController.js";
import authHandler from "../middleware/authHandler.js";

const adminRouter = express.Router();

adminRouter.use(authHandler);

adminRouter.get('/tables', tableController.list);
adminRouter.post('/tables', tableController.create);
adminRouter.delete('/tables/:tableName', tableController.remove);

adminRouter.get('/tables/:tableName/rows', rowController.list);
adminRouter.get('/tables/:tableName/rows/:rowId', rowController.get);
adminRouter.post('/tables/:tableName/rows', rowController.create);
adminRouter.put('/tables/:tableName/rows/:filterColumn/:filterValue', rowController.replace);
adminRouter.delete('/tables/:tableName/rows/:filterColumn/:filterValue', rowController.remove);

adminRouter.get('/tables/:tableName/reports', reportController.list);
adminRouter.post('/tables/:tableName/reports', reportController.create);
adminRouter.get('/tables/:tableName/reports/:reportId/status', reportController.status);
adminRouter.get('/tables/:tableName/reports/:reportId/download', reportController.download);
adminRouter.delete('/tables/:tableName/reports/:reportId', reportController.remove);

export default adminRouter;