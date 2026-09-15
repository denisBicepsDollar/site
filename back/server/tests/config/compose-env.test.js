import {describe, it} from "node:test";
import {fileURLToPath} from "url";
import {dirname, resolve, join} from "node:path";
import assert from "node:assert";
import {execSync} from "node:child_process";
import {readFileSync, existsSync} from "fs";
import yaml from "yaml";
import data from './compose.schema.json' with {type: 'json'}

const __dirname = dirname(fileURLToPath(import.meta.url));

const workerVariablesInCode = data.worker;

const mainPath = resolve(__dirname, '../../../../');
const mainComposePath = join(mainPath, 'docker-compose.yml');
const devComposePath = join(mainPath, 'docker-compose.dev.yml');
const envExamplePath = join(mainPath, '.env.example');
const targetBackEndPath = join(mainPath, 'back/server');

if (!existsSync(mainComposePath)) throw new Error('Fatal error: main docker-compose file does not exist');
if (!existsSync(devComposePath)) throw new Error('Fatal error: dev docker-compose file does not exist');
if (!existsSync(envExamplePath)) throw new Error('Fatal error: .env.example file does not exist');

const rawVariablesCode = execSync(
    `grep -rhPo 'process\\.env\\.[a-zA-Z0-9_]+' ${resolve(__dirname, '../../', 'src')}/`,
    {
        encoding: 'utf8'
    });

const variablesInCode = new Set(
    rawVariablesCode
        .trim()
        .replaceAll('process.env.', '')
        .split('\n')
        .filter(line => line && !data.common.includes(line))
);

const rawVariablesEnvExample = execSync(
    `cat ${mainPath}/.env.example | grep -Po '^[^=#]+'`,
    {
        encoding: 'utf8'
    });

const variablesInEnvExample = new Set(
    rawVariablesEnvExample
        .trim()
        .split('\n')

);


describe('Docker compose Config Tests', () => {

    const mainConfig = yaml.parse(readFileSync(mainComposePath, 'utf8'))
    const devConfig = yaml.parse(readFileSync(devComposePath, 'utf8'))

    it('should ensure .env.example contains all environment variables used in code', () => {
            const undocumented = [...variablesInCode].filter(
                v => ![...variablesInEnvExample].includes(v))
            assert.strictEqual(
                undocumented.length,
                0,
                `Documentation error! The following variables are missing in .env.example: ${undocumented.join(', ')}`);
        }
    )

    for (const serviceName in mainConfig.services) {
        const service = mainConfig.services[serviceName];
        const serviceDev = devConfig.services[serviceName];

        if (service.build) {
            describe(`Test for ${serviceName}`, () => {

                const requiredVariablesCode =
                    serviceName === 'worker' ? workerVariablesInCode : variablesInCode;
                
                const rawBuildPath = typeof service.build === 'string'
                    ? service.build
                    : service.build.context;

                const normalizeServicePath = resolve(mainPath, rawBuildPath);


                it('should have a valid build context path matching the backend service target', () => {
                    assert.strictEqual(
                        normalizeServicePath === targetBackEndPath,
                        true,
                        `Fatal error: target docker-compose build path is invalid. Expected: "${targetBackEndPath}", got: "${normalizeServicePath}"`
                    )
                })

                const prodVariablesList = new Set(service.environment ? Object.keys(service.environment) : []);


                it('should ensure production docker-compose environment blocks cover all variables used in code', () => {
                        const undocumented = [...requiredVariablesCode].filter(
                            v => ![...prodVariablesList].includes(v))
                        assert.strictEqual(
                            undocumented.length,
                            0,
                            `Deployment error! The following environment variables required by code are missing in production docker-compose for service "${serviceName}": ${undocumented.join(', ')}`);
                    }
                )
                const devVariablesList = new Set(serviceDev.environment ? Object.keys(serviceDev.environment) : []);

                it('should ensure dev environment variables do not override critical missing prod configs',
                    () => {
                        const undocumented = [...devVariablesList]
                            .filter(v => ![...prodVariablesList].includes(v))

                        if (undocumented.length) console.warn(
                            `[NOTICE] Service "${serviceName}" has variables defined in dev 
                            that are missing in prod: ${undocumented.join(', ')}`)
                    }
                )
                it('should ensure production docker-compose does not contain dead or unused variables', () => {

                    const deadVariables = [...prodVariablesList].filter(
                        v => ![...requiredVariablesCode].includes(v)
                    );

                    assert.strictEqual(
                        deadVariables.length,
                        0,
                        `Cleanliness error! Dead (unused in code) variables found in docker-compose.yml for service "${serviceName}": ${deadVariables.join(', ')}`
                    );
                })
            });
        }
    }
});
