import * as healthService from "../services/Health/healthService.js";

export async function health(req, res) {

    const healthStatus = await healthService.healthCheck();
    if (healthStatus.status === 'degraded') {
        return res.status(503).json(healthStatus)
    }
    return res.status(200).json(healthStatus);
}