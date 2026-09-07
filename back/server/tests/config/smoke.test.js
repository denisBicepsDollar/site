import {after, describe, it} from "node:test";
import {execSync} from "node:child_process";
import assert from "node:assert";

describe('Production Docker Smoke Test', () => {

    after(() => {
        console.log('Cleaning up docker containers...');
        try {
            execSync('docker compose down', {stdio: 'ignore'});
        } catch (err) {
            console.log(err);
        }
    })


    it('should successfully boot the entire stack and keep backend container alive', () => {
        console.log('Starting docker compose stack (building and running)...');

        execSync(`docker compose -f ${mainComposePath} up -d --build`, {stdio: 'inherit'});

        console.log('Waiting 4 seconds for application initialization...');

        execSync('sleep 4');

        const containerState = execSync('docker compose ps api --format "{{.State}}"', {encoding: 'utf8'}).trim();
        console.log(`Current backend container state: "${containerState}"`);

        assert.strictEqual(
            containerState,
            'running',
            `Critical error: Backend container crashed on startup! Expected status "running", but got "${containerState}". Run "docker compose logs api" to see why.`
        );
    })
})