import * as healthRepo from "../../db/health/healthRepo.js";

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
        components: {
            catalog_db: 'ok',
            reports_db: 'ok',
            users_db: 'ok',
        }
    };
    const [catalogDbHealth, reportsDbHealth, usersDbHealth] = await Promise.all([
        healthRepo.catalogDbHealth(),
        healthRepo.reportsDbHealth(),
        healthRepo.usersDbHealth()
    ])

    if (catalogDbHealth === 'error' || reportsDbHealth === 'error' || usersDbHealth === 'error') {
        healthStatus.status = 'degraded';
        healthStatus.components.catalog_db = catalogDbHealth;
        healthStatus.components.reports_db = reportsDbHealth;
        healthStatus.components.users_db = usersDbHealth;
    }
    cachedStatus = healthStatus;
    lastCheckTime = now;

    return healthStatus;
}