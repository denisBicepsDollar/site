import express from "express";
import * as healthController from "../controllers/healthController.js";

const healthRouter = express.Router();
healthRouter.prefix = '/health';


healthRouter.get('/', healthController.health)

healthRouter.get('/ping', (req, res) => {
    return res.status(200).json('ok');
})


export default healthRouter;