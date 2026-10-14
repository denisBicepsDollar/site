import * as healthRepo from "../db/healthRepo.js";

let cachedStatus = null;
let lastCheckTime = 0;
const CACHE_TTL_MS = 20000;

export async function healthCheck() {
    const now = Date.now();

    if (cachedStatus && (now - lastCheckTime) < CACHE_TTL_MS) {
        return cachedStatus;
    }

    const healthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
    };
    const dbHealth = await Promise.all([
        healthRepo.dbHealth(),
    ])

    if (dbHealth === 'error') {
        healthStatus.status = 'degraded';
    }
    cachedStatus = healthStatus;
    lastCheckTime = now;

    return healthStatus;
}