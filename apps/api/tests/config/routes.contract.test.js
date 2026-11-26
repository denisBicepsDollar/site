import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {existsSync, readFileSync, readdirSync} from "node:fs";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(testDir, "../../../..");
const adminSrc = join(root, "apps/admin/src");
const shopSrc = join(root, "apps/shop");
const backendRoutes = join(root, "apps/api/src/routes/routes.ts");
const backendAdminRoutes = join(root, "apps/api/src/routes/admin.ts");
const nginxFiles = [
    join(root, "infra/nginx/nginx.conf"),
    join(root, "infra/nginx/nginx.dev.conf"),
    join(root, "infra/nginx/nginx.ci.conf"),
];

function sourceFiles(directory) {
    return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory()
            ? sourceFiles(path)
            : /\.(?:js|jsx|ts|tsx)$/.test(entry.name) ? [path] : [];
    });
}

function sourceText(directory) {
    return sourceFiles(directory).map((file) => readFileSync(file, "utf8")).join("\n");
}

for (const path of [adminSrc, shopSrc, backendRoutes, backendAdminRoutes, ...nginxFiles]) {
    if (!existsSync(path)) throw new Error(`Required API contract path not found: ${path}`);
}

const adminText = sourceText(adminSrc);
const shopText = sourceText(shopSrc);
const routesText = readFileSync(backendRoutes, "utf8");
const adminRoutesText = readFileSync(backendAdminRoutes, "utf8");

describe("Frontend/backend API contracts", () => {
    it("keeps admin clients on the versioned, authenticated API endpoints", () => {
        assert.match(adminText, /\/api\/v1\/admin\/products/);
        assert.match(adminText, /\/api\/v1\/admin\/orders/);
        assert.match(adminText, /\/auth\/v1\/validation/);
        assert.match(routesText, /\/auth\/v1\/login/);
        assert.match(routesText, /\/auth\/v1\/validation/);
        assert.match(routesText, /app\.use\("\/api\/v1\/admin",\s*adminRouter\)/);
        assert.match(adminRoutesText, /adminRouter\.use\(authHandler\)/);
        assert.match(adminRoutesText, /adminRouter\.get\("\/products"/);
        assert.match(adminRoutesText, /adminRouter\.get\("\/products\/:id"/);
        assert.match(adminRoutesText, /adminRouter\.post\("\/products"/);
        assert.match(adminRoutesText, /adminRouter\.patch\("\/products\/bulk"/);
        assert.match(adminRoutesText, /adminRouter\.post\("\/products\/bulk-delete"/);
        assert.match(adminRoutesText, /adminRouter\.patch\("\/products\/:id"/);
        assert.match(adminRoutesText, /adminRouter\.delete\("\/products\/:id"/);
        assert.match(adminRoutesText, /adminRouter\.post\("\/products\/images"/);
        assert.match(routesText, /\/auth\/v1\/logout/);
        assert.match(adminRoutesText, /adminRouter\.get\("\/orders"/);
        assert.match(adminRoutesText, /adminRouter\.get\("\/orders\/:id"/);
        assert.match(adminRoutesText, /adminRouter\.patch\("\/orders\/:id\/status"/);
    });

    it("points shop API calls at endpoints registered by Express", () => {
        assert.match(shopText, /\/api\/v1\/products/);
        assert.match(shopText, /\/api\/v1\/orders/);
        assert.match(shopText, /\/api\/v1\/contacts/);
        assert.match(routesText, /app\.get\("\/api\/v1\/products"/);
        assert.match(routesText, /app\.post\("\/api\/v1\/orders"/);
        assert.match(routesText, /app\.post\("\/api\/v1\/contacts"/);
    });

    it("proxies the API and auth paths from every nginx environment", () => {
        for (const path of nginxFiles) {
            const config = readFileSync(path, "utf8");
            assert.match(config, /location\s+(?:\^~\s+)?\/api\//, `${path} must proxy /api/`);
            assert.match(config, /proxy_pass\s+http:\/\/api_backend/, `${path} must use the API upstream`);
            assert.match(config, /location\s+(?:\^~\s+)?\/auth\//, `${path} must proxy /auth/`);
            assert.match(config, /location\s+\^~\s+\/uploads\/admin-products\//, `${path} must proxy uploaded product images`);
        }
    });
});
