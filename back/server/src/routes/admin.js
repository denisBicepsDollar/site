import express from 'express';
import * as tableController from "../controllers/tableController.js";
import * as rowController from "../controllers/rowController.js";
import authHandler from "../middleware/authHandler.js";

const adminRouter = express.Router();
adminRouter.prefix = '/admin';
adminRouter.use(authHandler);

adminRouter.get('/tables', tableController.list);


adminRouter.get('/tables/:tableName/rows', rowController.list);
adminRouter.get('/tables/:tableName/rows/:rowId', rowController.get);
adminRouter.post('/tables/:tableName/rows', rowController.create);
adminRouter.put('/tables/:tableName/rows/:filterColumn/:filterValue', rowController.replace);
adminRouter.delete('/tables/:tableName/rows/:filterColumn/:filterValue', rowController.remove);


export default adminRouter;