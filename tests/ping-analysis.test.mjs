import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSample,readDataset,summarize} from '../src/lib/ping-analysis.mjs';
test('Windows and Linux response parsing',()=>{
  assert.equal(parseSample('Reply from 192.168.1.1: bytes=32 time=23ms TTL=64'),23);
  assert.equal(parseSample('来自 192.168.1.1 的回复: 字节=32 时间=19ms TTL=64'),19);
  assert.equal(parseSample('64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=13.4 ms'),13.4);
  assert.equal(parseSample('请求超时。'),null);
  assert.equal(parseSample('Destination host unreachable'),undefined);
  assert.equal(parseSample('时间<1ms'),undefined);
});
test('CSV export format round trip including timeout and BOM',()=>{
  assert.deepEqual(readDataset('\uFEFFindex,rtt_ms,status\r\n1,20,received\r\n2,,timeout\r\n3,30.5,received').samples,[20,null,30.5]);
});
test('reject malformed lines instead of silently discarding',()=>{
  const d=readDataset('21\nnot a sample\ntime=19ms');
  assert.equal(d.invalid,1);assert.equal(d.samples.length,2);assert.equal(d.errors.length,1);
});
test('skip explicitly recognized Linux summaries',()=>{
  const d=readDataset('PING example.com (1.1.1.1): 56 data bytes\n64 bytes from example: time=21.2 ms\n--- example.com ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss\nrtt min/avg/max/mdev = 21/21/21/0 ms');
  assert.deepEqual(d.samples,[21.2]);assert.equal(d.invalid,0);
});
test('summaries, nearest-rank and all-timeout input',()=>{
  assert.deepEqual(summarize([20,null,50,null,null]).maxRun,2);
  assert.equal(summarize([20,null,50]).p95,50);
  assert.equal(Number.isNaN(summarize([null,null]).avg),true);
});

test('analyzer script can reach A/B comparison controls outside main tool container', async()=>{
  const {readFileSync}=await import('node:fs');
  const page=readFileSync(new URL('../src/pages/tools/network-analyzer.astro', import.meta.url),'utf8');
  assert.match(page,/document\.getElementById\(id\)/);
  assert.match(page,/id="an-compare-run"/);
  assert.match(page,/el\('an-compare-run'\)\.addEventListener/);
});


test('editing inputs invalidates stale reports and comparisons', async()=>{
  const {readFileSync}=await import('node:fs');
  const page=readFileSync(new URL('../src/pages/tools/network-analyzer.astro', import.meta.url),'utf8');
  assert.match(page,/const invalidate = \(\) =>/);
  assert.match(page,/field\('an-samples'\)\.addEventListener\('input',[\s\S]*?invalidate\(\)/);
  assert.match(page,/\['an-compare-a','an-compare-b'\]/);
  assert.match(page,/if\(!report\)return/);
  assert.match(page,/if \(!samples\.length\) return/);
});

test('do not accept unrelated text that happens to contain an RTT-looking token',()=>{
  assert.equal(parseSample('Debug note: server time=23ms unrelated'),undefined);
  assert.equal(parseSample('64 bytes from example: icmp_seq=7 ttl=52 time=23.6 ms'),23.6);
  assert.equal(parseSample('Reply from 10.0.0.1: bytes=32 time=4ms TTL=64'),4);
});
test('reject malformed exported CSV statuses and values',()=>{
  assert.equal(readDataset('index,rtt_ms,status\n1,22,received\n2,broken,received\n3,,mystery').invalid,2);
});
test('guard asynchronous log import against edits made during file reading',async()=>{
  const {readFileSync}=await import('node:fs');
  const page=readFileSync(new URL('../src/pages/tools/network-analyzer.astro',import.meta.url),'utf8');
  assert.match(page,/const version = \+\+fileReadVersion/);
  assert.match(page,/if\(version!==fileReadVersion\)return/);
});


test('CSV sample IDs must be sequential, never duplicates or gaps',()=>{
  assert.equal(readDataset('index,rtt_ms,status\n1,20,received\n1,21,received\n3,,timeout').invalid,1);
  assert.equal(readDataset('index,rtt_ms,status\n1,20,received\n3,21,received').invalid,1);
});
test('CSV header does not consume sample limit',()=>{
  const csv = 'index,rtt_ms,status\n'+Array.from({length:5000},(_,i)=>`${i+1},20,received`).join('\n');
  const parsed=readDataset(csv);
  assert.equal(parsed.lineCount,5000);
  assert.equal(parsed.samples.length,5000);
  assert.equal(parsed.invalid,0);
});

test('Linux summary with unlisted lost probes is not represented as zero loss',()=>{
  const data=readDataset('PING example (1.1.1.1)\n64 bytes from 1.1.1.1: icmp_seq=1 ttl=55 time=23.1 ms\n64 bytes from 1.1.1.1: icmp_seq=3 ttl=55 time=25.2 ms\n--- example ping statistics ---\n3 packets transmitted, 2 received, 33% packet loss');
  assert.deepEqual(data.samples,[23.1,25.2]);
  assert.match(data.summaryMismatch,/发送 3、收到 2/);
});
test('complete Linux log with no lost packets does not trigger mismatch',()=>{
  const data=readDataset('64 bytes from 1.1.1.1: icmp_seq=1 ttl=55 time=23.1 ms\n64 bytes from 1.1.1.1: icmp_seq=2 ttl=55 time=25.2 ms\n2 packets transmitted, 2 received, 0% packet loss');
  assert.equal(data.summaryMismatch,'');
});
test('Windows summary confirms explicitly timed-out probes',()=>{
  const data=readDataset('Reply from 1.1.1.1: bytes=32 time=20ms TTL=55\nRequest timed out.\nPackets: Sent = 2, Received = 1, Lost = 1 (50% loss)');
  assert.deepEqual(data.samples,[20,null]);
  assert.equal(data.summaryMismatch,'');
});


test('full English Windows ping output ignores round-trip section labels',()=>{
  const log = `Pinging 1.1.1.1 with 32 bytes of data:
Reply from 1.1.1.1: bytes=32 time=20ms TTL=55
Reply from 1.1.1.1: bytes=32 time=21ms TTL=55
Ping statistics for 1.1.1.1:
    Packets: Sent = 2, Received = 2, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 20ms, Maximum = 21ms, Average = 20ms`;
  const result=readDataset(log);
  assert.deepEqual(result.samples,[20,21]);
  assert.equal(result.invalid,0);
  assert.equal(result.summaryMismatch,'');
});

test('full Chinese Windows ping output ignores round-trip section labels',()=>{
  const log = `正在 Ping 1.1.1.1 具有 32 字节的数据:
来自 1.1.1.1 的回复: 字节=32 时间=20ms TTL=55
来自 1.1.1.1 的回复: 字节=32 时间=21ms TTL=55
1.1.1.1 的 Ping 统计信息:
    数据包: 已发送 = 2，已接收 = 2，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 20ms，最长 = 21ms，平均 = 20ms`;
  const result=readDataset(log);
  assert.deepEqual(result.samples,[20,21]);
  assert.equal(result.invalid,0);
  assert.equal(result.summaryMismatch,'');
});

test('Chinese Windows packet summary with full-width commas detects missing samples',()=>{
  const log='来自 1.1.1.1 的回复: 字节=32 时间=20ms TTL=55\n数据包: 已发送 = 2，已接收 = 1，丢失 = 1 (50% 丢失)';
  const result=readDataset(log);
  assert.match(result.summaryMismatch,/发送 2、收到 1/);
});
