import express from 'express';
import authHandler from "../middleware/authHandler.js";

const adminRouter = express.Router();
adminRouter.prefix = '/api';
adminRouter.use(authHandler);

// adminRouter.get('/tables', tableController.list);

//
// adminRouter.get('/tables/:tableName/rows', rowController.list);
// adminRouter.get('/tables/:tableName/rows/:rowId', rowController.get);
// adminRouter.post('/tables/:tableName/rows', rowController.create);
// adminRouter.put('/tables/:tableName/rows/:filterColumn/:filterValue', rowController.replace);
// adminRouter.delete('/tables/:tableName/rows/:filterColumn/:filterValue', rowController.remove);


export default adminRouter;