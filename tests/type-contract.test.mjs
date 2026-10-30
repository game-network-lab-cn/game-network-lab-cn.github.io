import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { troubleshootingSteps } from '../src/lib/ping-analysis.mjs';

test('troubleshootingSteps runtime export and TypeScript declaration stay in sync', () => {
  assert.equal(typeof troubleshootingSteps, 'function');
  const declaration = readFileSync(new URL('../src/lib/ping-analysis.d.mts', import.meta.url), 'utf8');
  assert.match(declaration, /export function troubleshootingSteps\(/);
  assert.deepEqual(typeof troubleshootingSteps([20, 30]), 'object');
});
