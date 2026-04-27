import { spawn } from 'node:child_process';

const child = spawn(process.execPath, ['src/index.js'], { stdio: ['pipe', 'pipe', 'inherit'] });
let output = '';
child.stdout.on('data', (chunk) => { output += chunk.toString(); });

function send(message) {
  child.stdin.write(JSON.stringify(message) + '\n');
}

send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke-test', version: '1.0.0' } } });
setTimeout(() => send({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }), 100);
setTimeout(() => send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }), 200);
setTimeout(() => {
  child.kill('SIGTERM');
  if (!output.includes('search_skills') || !output.includes('popular_skills')) {
    console.error(output);
    process.exit(1);
  }
  console.log('Smoke test passed');
}, 1000);
