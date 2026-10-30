import test from 'node:test';
import assert from 'node:assert/strict';
import { troubleshootingSteps } from '../src/lib/ping-analysis.mjs';

test('all-timeout data does not assert outage', () => {
  const steps = troubleshootingSteps([null,null,null], {target:'外部测试目标'}).join(' ');
  assert.match(steps,/不足以证明断网/);
  assert.doesNotMatch(steps,/运营商故障/);
});
test('spike leads to time-series inspection', () => {
  const steps = troubleshootingSteps([20,21,145,20], {connection:'有线'}).join(' ');
  assert.match(steps,/时序/);
});
test('wifi recommends controlled wired comparison', () => {
  const steps = troubleshootingSteps([20,21,22], {connection:'Wi-Fi'}).join(' ');
  assert.match(steps,/有线对照/);
});
test('stable ICMP does not eliminate application causes', () => {
  const steps = troubleshootingSteps([20,21,20], {connection:'有线'}).join(' ');
  assert.match(steps,/帧时间/);
});
