// ── routes.contract.test.js ───────────────────────────────────────────────────
// Контрактные тесты маршрутов: фронтенд ⇄ Express ⇄ nginx (prod и dev).
//
// Проверяются четыре контракта:
//   1. каждый вызов магазина проходит через proxy-локейшен prod-хоста public;
//   2. каждый вызов админки проходит через proxy-локейшен prod-хоста admin;
//   3. у каждого вызова фронтенда есть маршрут в Express;
//   4. наборы proxy-локейшенов prod и dev не расходятся (отдельно по хостам).
//
// Роль nginx-хоста (public / admin) выводится из server_name, поэтому
// nginx-конфиги трогать не нужно.
//
// ВНИМАНИЕ: сбор вызовов фронтенда пока построчный (grep). Многострочные вызовы
// вида `fetch(\n  '/path'` он не видит — это отдельная задача (мультистрочный
// сканер), см. TODO внизу файла.

import {describe, it} from "node:test";
import {fileURLToPath} from "url";
import {dirname, resolve, join} from "node:path";
import assert from "node:assert";
import {execFileSync} from "node:child_process";
import {readFileSync, existsSync} from "fs";
import dotenv from "dotenv";
import NginxParser from "@webantic/nginx-config-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const mainPath = resolve(__dirname, '../../../../');
const frontendAdminPath = join(mainPath, 'back/frontend/src');
const frontendShopPath = join(mainPath, 'shop');
const nginxProdConfigPath = join(mainPath, 'nginx/nginx.conf');
const nginxDevConfigPath = join(mainPath, 'nginx/nginx.dev.conf');
const envExamplePath = join(__dirname, '.env.example');

const frontendAdminCallNames = ['fetch', 'apiFetch'];
const frontendShopCallNames = ['fetch'];

const nginxApiUpstream = 'http://api_backend';
const adminHostPrefix = 'admin.';
const requiredNginxRoles = ['public', 'admin'];

if (!existsSync(envExamplePath)) throw new Error(`Fatal error: ${envExamplePath} does not exist`);
if (!existsSync(frontendAdminPath)) throw new Error(`Fatal error: ${frontendAdminPath} does not exist`);
if (!existsSync(frontendShopPath)) throw new Error(`Fatal error: ${frontendShopPath} does not exist`);
if (!existsSync(nginxProdConfigPath)) throw new Error(`Fatal error: ${nginxProdConfigPath} does not exist`);
if (!existsSync(nginxDevConfigPath)) throw new Error(`Fatal error: ${nginxDevConfigPath} does not exist`);

dotenv.config({path: envExamplePath});

const {createApp} = await import('../../src/server.js');

if (typeof createApp !== 'function') {
    throw new Error('Fatal error: src/server.js does not export createApp()');
}

// ── helpers ───────────────────────────────────────────────────────────────────

/**
 * Собирает из исходников строковые аргументы вызовов fetch/apiFetch.
 * execFileSync (без shell) — аргументы передаются grep'у как есть, поэтому
 * кавычки и backtick'и в паттерне экранировать не нужно.
 *
 * TODO: заменить на чтение файлов целиком и регулярку с флагом `s`, иначе
 * многострочные вызовы не попадают в выборку.
 */
function collectRawCalls(rootPath, callNames) {
    const backtick = String.fromCharCode(96);
    const pattern = `(${callNames.join('|')})\\(['${backtick}]\\K[^'${backtick}]+(?=['${backtick}])`;

    let output;
    try {
        output = execFileSync(
            'grep',
            ['-rPho', pattern, '--include=*.js', '--include=*.jsx', rootPath],
            {encoding: 'utf8'});
    } catch (error) {
        if (error.status === 1) return [];   // grep: совпадений не найдено
        throw new Error(`Fatal error: не удалось просканировать ${rootPath}`, {cause: error});
    }
    return output.trim().split('\n').filter(Boolean);
}

/**
 * Приводит найденный URL к виду маршрута Express.
 * Порядок важен: сначала разворачиваем encodeURIComponent, потом остальные ${}.
 */
function normalizeRoutePath(rawCallPath) {
    return rawCallPath
        .replace(/\?.*$/, '')                                  // отбросить query-строку
        .replace(/\$\{encodeURIComponent\((.+?)\)\}/g, ':$1')  // ${encodeURIComponent(id)} -> :id
        .replace(/\$\{(.+?)\}/g, ':$1');                       // ${productId} -> :productId
}

/**
 * Собирает маршруты из стека Express.
 *
 * ВАЖНО: Express 5 не отдаёт префикс смонтированного роутера — у layer.handle
 * нет ни prefix, ни regexp. Поэтому обходчик читает свойство `prefix`, которое
 * роутер выставляет вручную (см. src/routes/admin.js). Настоящий префикс живёт
 * в src/routes/routes.js — это второй источник правды, расхождение между ними
 * тест не поймает.
 */
function walkStackExpress(stack) {
    const routes = new Set();

    for (const layer of stack) {
        if (layer.handle.stack && layer.handle.prefix) {
            for (const subLayer of layer.handle.stack) {
                if (subLayer.route) {
                    routes.add(layer.handle.prefix + subLayer.route.path);
                }
            }
        }
        if (layer.route) {
            routes.add(layer.route.path);
        }
    }
    return routes;
}

/** Определяет роль server-блока nginx по его server_name. */
function resolveServerRole(serverName) {
    if (!serverName) return null;

    const hosts = String(serverName).trim().split(/\s+/).filter(Boolean);
    if (hosts.length === 0) return null;

    return hosts.every(host => host.startsWith(adminHostPrefix)) ? 'admin' : 'public';
}

/** Достаёт префикс из ключа парсера вида "location ^~ /admin/". */
function extractLocationPrefix(locationKey) {
    const modifiers = ['=', '^~', '~*', '~'];

    let prefix = locationKey.replace(/^location/, '').trim();
    for (const modifier of modifiers) {
        if (prefix.startsWith(modifier)) {
            prefix = prefix.slice(modifier.length).trim();
            break;
        }
    }
    return prefix;
}

/**
 * Собирает proxy-локейшены, ведущие на API, с разбивкой по ролям хостов.
 * Возвращает { public: [...], admin: [...] }.
 */
function walkNginxConfig(parsedConfig, configName) {
    const proxies = {};

    const addProxy = (role, prefix) => {
        if (!proxies[role]) proxies[role] = [];
        if (!proxies[role].includes(prefix)) proxies[role].push(prefix);
    };

    for (const server of parsedConfig.http.server) {
        const role = resolveServerRole(server.server_name);

        if (!role) {
            console.warn(`Предупреждение: server-блок без server_name в ${configName} пропущен`);
            continue;
        }

        for (const key of Object.keys(server)) {
            if (!key.startsWith('location')) continue;

            const block = server[key];
            if (!block || typeof block !== 'object') continue;
            if (block.proxy_pass !== nginxApiUpstream) continue;

            addProxy(role, extractLocationPrefix(key));
        }
    }
    return proxies;
}

// ── данные ────────────────────────────────────────────────────────────────────

const frontendAdminCalls = new Set(
    collectRawCalls(frontendAdminPath, frontendAdminCallNames).map(normalizeRoutePath));

const frontendShopCalls = new Set(
    collectRawCalls(frontendShopPath, frontendShopCallNames).map(normalizeRoutePath));

const frontendAllCalls = new Set([...frontendAdminCalls, ...frontendShopCalls]);

describe('Routes Contract Tests', () => {

    const app = createApp();
    const backendRoutes = walkStackExpress(app.router.stack);

    const parser = new NginxParser();
    const nginxProdRoutes = walkNginxConfig(
        parser.toJSON(readFileSync(nginxProdConfigPath, 'utf8')), 'nginx.conf');
    const nginxDevRoutes = walkNginxConfig(
        parser.toJSON(readFileSync(nginxDevConfigPath, 'utf8')), 'nginx.dev.conf');

    it('should resolve public and admin roles in both nginx configs', () => {
        const unresolved = [];

        for (const [label, routes] of [['nginx.conf', nginxProdRoutes], ['nginx.dev.conf', nginxDevRoutes]]) {
            for (const role of requiredNginxRoles) {
                if (!routes[role] || routes[role].length === 0) unresolved.push(`${label}:${role}`);
            }
        }

        assert.strictEqual(unresolved.length, 0,
            `Fatal error: не найдены proxy-локейшены для ролей ${unresolved.join(', ')}. ` +
            'Проверь server_name и proxy_pass в nginx-конфигах.');
    })

    it('should find at least one frontend call to scan', () => {
        const empty = [];

        if (frontendShopCalls.size === 0) empty.push('shop');
        if (frontendAdminCalls.size === 0) empty.push('admin');

        assert.strictEqual(empty.length, 0,
            `Fatal error: во фронтенде (${empty.join(', ')}) не найдено ни одного вызова fetch — ` +
            'проверки ниже прошли бы впустую.');
    })

    it('should proxy every shop API call through a prod public nginx location', () => {
        const nginxProdPublic = [...nginxProdRoutes.public];
        const undocumented = [...frontendShopCalls]
            .filter(v => !nginxProdPublic.some(prefix => v.startsWith(prefix)));

        assert.strictEqual(undocumented.length, 0,
            `Routes mismatch: вызовы магазина не проходят ни через один public-локейшен ` +
            `prod nginx (${nginxProdPublic.join(', ')}):\n${undocumented.join('\n')}`);
    })

    it('should proxy every admin API call through a prod admin nginx location', () => {
        const nginxProdAdmin = [...nginxProdRoutes.admin];
        const undocumented = [...frontendAdminCalls]
            .filter(v => !nginxProdAdmin.some(prefix => v.startsWith(prefix)));

        assert.strictEqual(undocumented.length, 0,
            `Routes mismatch: вызовы админки не проходят ни через один admin-локейшен ` +
            `prod nginx (${nginxProdAdmin.join(', ')}):\n${undocumented.join('\n')}`);
    })

    it('should have a backend route for every frontend API call', () => {
        const backendArray = [...backendRoutes];
        const undocumented = [...frontendAllCalls].filter(v => !backendArray.includes(v));

        assert.strictEqual(undocumented.length, 0,
            `Routes mismatch: у этих вызовов фронтенда нет маршрута в Express:\n` +
            `${undocumented.join('\n')}`);
    })

    it('should keep prod and dev nginx proxy prefixes in sync', () => {
        const errors = [];

        for (const role of requiredNginxRoles) {
            const prodPrefixes = nginxProdRoutes[role];
            const devPrefixes = nginxDevRoutes[role];

            const missingInDev = prodPrefixes.filter(v => !devPrefixes.includes(v));
            const missingInProd = devPrefixes.filter(v => !prodPrefixes.includes(v));

            if (missingInDev.length > 0) {
                errors.push(`Missing in dev ${role}: [${missingInDev.join(', ')}]`);
            }
            if (missingInProd.length > 0) {
                errors.push(`Missing in prod ${role}: [${missingInProd.join(', ')}]`);
            }
        }

        assert.strictEqual(errors.length, 0,
            `Routes mismatch:\n${errors.join('\n')}`);
    })
})