/**
 * Run Next with cwd = this app root, even if the shell/IDE started in a parent folder (e.g. ~/Documents).
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(projectRoot);

const nextCli = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
const args = process.argv.slice(2);

const result = spawnSync(process.execPath, [nextCli, ...args], {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env,
});

process.exit(result.status === null ? 1 : result.status);
