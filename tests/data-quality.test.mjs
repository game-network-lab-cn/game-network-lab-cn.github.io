import test from 'node:test';
import assert from 'node:assert/strict';
import {assessDataset, comparisonNotes} from '../src/lib/ping-analysis.mjs';
test('small sample and missing context are explicitly qualified',()=>{
 const q=assessDataset([10,20,null]);
 assert.equal(q.status,'存在解释限制');
 assert.ok(q.issues.some(x=>x.includes('样本较少')));
 assert.ok(q.issues.some(x=>x.includes('游戏数据包')));
});
test('complete context does not invent packet-loss causes',()=>{
 const q=assessDataset(Array(30).fill(20),{target:'gateway',timestamp:'2026-10-30',intervalKnown:true});
 assert.equal(q.status,'输入信息相对完整');
 assert.equal(q.issues.length,0);
});
test('comparison caveats note unlike sample counts',()=>{
 const notes=comparisonNotes([20,30,40],[20,30,40,50]);
 assert.ok(notes.some(x=>x.includes('样本数量不同')));
 assert.ok(notes.some(x=>x.includes('P95')));
});
