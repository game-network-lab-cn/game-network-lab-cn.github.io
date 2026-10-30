/** Parse supported Ping samples. The application never infers actual game-traffic loss. */
export function parseSample(line) {
  const t = line.trim();
  if (!t) return undefined;
  if (/^(?:timeout|超时|\*|request timed out\.?|请求超时[。.]?)$/i.test(t) || /(?:request timed out|请求超时)/i.test(t)) return null;
  // Host-unreachable messages are NOT response timeouts; refuse to fold them into a loss rate.
  if (/(?:destination (?:host|net) unreachable|目标主机不可达|无法访问目标主机|一般故障|general failure)/i.test(t)) return undefined;
  // Windows commonly reports time<1ms / 时间<1ms. Treat as an upper bound, not an exact 1ms observation.
  if (/(?:time|时间)\s*<\s*1\s*(?:ms|毫秒)/i.test(t)) return undefined;
  // Accept only standalone values or recognisable per-packet Ping replies, not unrelated prose containing time=... .
  const reply = /^(?:reply from\s+|来自\s+.+?的回复\s*[:：]|\d+\s+bytes from\s+)/i.test(t);
  const match = reply ? t.match(/(?:time|时间)\s*=\s*(\d+(?:\.\d+)?)\s*(?:ms|毫秒)/i)
    : (t.match(/^(?:time|时间)\s*=\s*(\d+(?:\.\d+)?)\s*(?:ms|毫秒)$/i) ?? t.match(/^(\d+(?:\.\d+)?)\s*(?:ms|毫秒)?$/i));
  if (!match) return undefined;
  const v = Number(match[1]);
  return Number.isFinite(v) && v >= 0 && v <= 600000 ? v : undefined;
}

export function isLogHeader(line) {
  const t = line.trim();
  return /^(?:pinging |ping |正在\s*ping\b|ping statistics|--- .* ping statistics ---|packets:|round-trip|rtt min|已发送|已接收|数据包\s*[:：]|.* 的 [Pp]ing 统计信息|往返行程的估计时间|大约往返行程的估计时间|approximate round trip times|minimum\s*=|maximum\s*=|average\s*=|最短\s*=|最长\s*=|平均\s*=|\d+ packets transmitted|\d+\s*个数据包)/i.test(t)
    || /^\s*$/.test(t);
}

/** @returns {{samples:(number|null)[], invalid:number, ignored:number, lineCount:number, errors:string[]}} */
export function readDataset(input) {
  const lines = input.replace(/^\uFEFF/, '').split(/\r?\n/).filter(x=>x.trim());
  const isOwnCsv = lines[0]?.trim().toLowerCase() === 'index,rtt_ms,status';
  const body = isOwnCsv ? lines.slice(1) : lines.filter(x=>!isLogHeader(x));
  const samples = []; const errors = [];
  for (const [i,line] of body.entries()) {
    let value;
    if (isOwnCsv) {
      const columns = line.trim().split(',');
      if (columns.length===3 && /^\d+$/.test(columns[0]) && Number(columns[0])===i+1) {
        if (columns[2]==='timeout' && columns[1]==='') value=null;
        else if(columns[2]==='received' && /^\d+(?:\.\d+)?$/.test(columns[1])) value=parseSample(columns[1]);
      }
    } else value=parseSample(line);
    if (value===undefined) {
      if (errors.length<5) errors.push(`第 ${i+1} 条待解析行：${line.slice(0,90)}`);
    } else samples.push(value);
  }
  // Linux/macOS Ping often prints only replies; lost probes are absent from the body.
  // A summary mismatch cannot be repaired without inventing where missed probes occurred.
  let summaryMismatch = '';
  if (!isOwnCsv) {
    const summary = lines.map(line => {
      const unix = line.match(/^(\d+) packets transmitted,\s*(\d+)(?: packets)? received/i);
      const windows = line.match(/(?:Packets:\s*Sent\s*=|数据包:\s*已发送\s*=)\s*(\d+)\s*[,，]\s*(?:Received|已接收)\s*=\s*(\d+)/i);
      return unix || windows;
    }).find(Boolean);
    if (summary) {
      const sent=Number(summary[1]), got=Number(summary[2]);
      const observedReplies=samples.filter(x=>x!==null).length;
      if (sent !== samples.length || got !== observedReplies) {
        summaryMismatch=`日志摘要显示发送 ${sent}、收到 ${got}，但逐条可解析样本仅有 ${samples.length} 条（收到响应 ${observedReplies}）。可能存在未单独记录的丢包；无法可靠还原超时顺序，请改用逐次记录的完整样本或本工具 CSV。`;
      }
    }
  }
  return {samples, invalid:body.length-samples.length, ignored:lines.length-body.length-(isOwnCsv?1:0), lineCount:body.length, errors, summaryMismatch};
}

export function summarize(data) {
  const received=data.filter(v=>v!==null).sort((a,b)=>a-b);
  let maxRun=0,run=0;
  for (const v of data) {run=v===null?run+1:0; maxRun=Math.max(maxRun,run);}
  return {count:data.length,received:received.length,avg:received.length?received.reduce((a,b)=>a+b,0)/received.length:NaN,
    p95:received.length?received[Math.ceil(received.length*0.95)-1]:NaN,
    max:received.length?received.at(-1):NaN,maxRun,
    loss:data.length?100*(data.length-received.length)/data.length:NaN};
}

/** Conservative quality checks; these are data limitations, not a network health score. */
export function assessDataset(samples, meta = {}) {
  const issues = [];
  const count = samples.length;
  const received = samples.filter(v => v !== null);
  if (count < 20) issues.push('样本较少，仅适合初步观察；无法代表持续的网络表现。');
  if (!meta.target) issues.push('未记录明确的测试目标地址或名称，后续难以复测和比较。');
  if (!meta.timestamp) issues.push('未记录测试时段，无法核对异常是否与游戏症状同时发生。');
  if (!meta.intervalKnown) issues.push('采样间隔未从日志验证，不能据此推断实际超时持续时间。');
  if (received.length === 0) issues.push('没有收到响应的 RTT；目标可能不响应 ICMP，不能判断网络故障。');
  if (count > 0 && received.length < count) issues.push('超时比例仅反映输入探针样本，不能等同于游戏数据包丢包率。');
  return { status: issues.length ? '存在解释限制' : '输入信息相对完整', issues };
}

/** Compare only the observed distributions; never assign a cause. */
export function comparisonNotes(a, b) {
  const x = summarize(a), y = summarize(b);
  const notes = [];
  if (a.length !== b.length) notes.push('两组样本数量不同，结果可能受到观察窗口长度影响。');
  if (Number.isFinite(x.p95) && Number.isFinite(y.p95)) {
    const delta = y.p95-x.p95;
    notes.push(`测试 B 的 P95 RTT 比测试 A ${delta===0?'相同':`${delta>0?'高':'低'} ${Math.abs(delta).toFixed(1)} ms`}；这只是样本差异，不能直接判定原因。`);
  }
  if (x.loss !== y.loss) notes.push('两组标记超时的比例不同，应先核实目标和测量条件是否一致。');
  return notes;
}

/** Produce prioritized, evidence-bounded troubleshooting steps from observed samples. */
export function troubleshootingSteps(samples, meta = {}) {
  const stats = summarize(samples);
  const steps = [];
  if (!stats.received) {
    steps.push('先确认测试目标是否允许 ICMP 回应，并在同一设备上测试默认网关；全部超时不足以证明断网。');
    steps.push('换一个已知允许 Ping 的目标重复测试，记录测试时段和错误信息。');
  } else {
    if (stats.maxRun > 0 || stats.loss > 0) {
      steps.push('出现未收到响应的探针：先在相近时段分别测试默认网关和外部目标，确认异常出现在哪一组。');
      steps.push('如日志只有成功响应和汇总统计，请获取完整逐次样本，不要推测连续超时发生的位置。');
    }
    if (Number.isFinite(stats.avg) && Number.isFinite(stats.max) && stats.max - stats.avg >= 50) {
      steps.push('检测到至少一次明显高于均值的 RTT 样本；查看原始时序，确认尖峰是否重复出现且与卡顿时间吻合。');
    }
    if (stats.loss === 0 && stats.max - stats.avg < 50) {
      steps.push('这组探针未显示明显超时或大幅尖峰；如果游戏仍卡，请检查帧时间、游戏内网络提示及其他时间段。');
    }
  }
  if (meta.connection === 'Wi-Fi') steps.push('如果使用 Wi-Fi，可在同一设备、同一目标及相近时段进行有线对照，避免同时改变多个条件。');
  if (meta.target === '家庭网关') steps.push('网关测试主要观察本地链路；还应对已知允许 ICMP 的外部目标复测，不能以网关结果代表互联网路径。');
  else steps.push('外部目标的异常不一定由运营商造成；先与默认网关测试对照，并确认目标的 ICMP 应答策略。');
  steps.push('保存原始日志、目标、时段和接入方式；多次复现后再联系网络运营商或游戏支持。');
  return steps;
}
