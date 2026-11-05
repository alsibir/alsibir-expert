import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Optional executable override for environments with a system Chromium.
const temporary = mkdtempSync(join(tmpdir(), 'aps-mermaid-'));
try {
  const config = join(temporary, 'puppeteer.json');
  writeFileSync(config, JSON.stringify({
    ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH } : {}),
    ...(process.env.MERMAID_NO_SANDBOX === '1' ? { args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {}),
  }));
  const result = spawnSync(process.execPath, [
    'node_modules/@mermaid-js/mermaid-cli/src/cli.js',
    '-i', 'diagrams/anonymization-cycle/processing-sequence.mmd',
    '-o', 'public/images/diagrams/anonymization-processing-sequence.svg',
    '-t', 'neutral', '-b', '#ffffff', '-p', config,
  ], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
