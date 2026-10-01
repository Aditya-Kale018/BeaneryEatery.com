import { spawn } from 'node:child_process';

console.log('Starting Beanery backend and frontend...');

const api = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  env: process.env,
});

const web = spawn('node', ['./node_modules/vite/bin/vite.js'], {
  stdio: 'inherit',
  env: process.env,
});

function cleanup() {
  console.log('\nShutting down dev servers...');
  try { api.kill('SIGTERM'); } catch {}
  try { web.kill('SIGTERM'); } catch {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

api.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`API server exited with code ${code}`);
  }
});

web.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`Vite dev server exited with code ${code}`);
  }
});
