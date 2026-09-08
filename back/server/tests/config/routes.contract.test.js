import {execSync} from "node:child_process";
import {describe} from "node:test";
import {fileURLToPath} from "url";
import {dirname, join} from "node:path";


const __dirname = dirname(fileURLToPath(import.meta.url))

const frontendAdmin = join(__dirname, '../../../', 'frontend/src');
const frontendShop = join(__dirname, '../../../../', 'shop');


const rawFrontendAdmin = execSync("grep -rPho \"(fetch|apiFetch)\\(['\\`]\\K[^'\\`]+(?=['\\`])\" " + frontendAdmin, {
    encoding: 'utf-8'
});

const rawFrontendShop = execSync("grep -rPho \"fetch\\(['\\`]\\K[^'\\`]+(?=['\\`])\" " + frontendShop, {
    encoding: 'utf-8'
});
const combinedArray = [
    ...rawFrontendAdmin
        .trim()
        .replace(/\?.*/g, '')
        .replace(/\$\{(.+?)\}/g, ':$1')
        .replace(/:encodeURIComponent\((.+?)\)/g, ':$1')
        .split('\n'),
    ...rawFrontendShop
        .trim()
        .replace(/\?.*/g, '')
        .replace(/\$\{(.+?)\}/g, ':$1')
        .split('\n')
];

const frontendAdmin = new Set(rawFrontendAdmin);
const frontendShop = new Set(rawFrontendShop);
const frontendSet = new Set(combinedArray);

console.log(frontendList);


describe('Routes contract tests', () => {

})