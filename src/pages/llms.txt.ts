import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(
    `# 低延迟实验室

> 面向在线游戏玩家的网络测量、指标解释与故障定位知识站。

## 核心范围

- Ping 与 RTT
- Packet Loss 与突发丢包
- Packet Delay Variation 与 Jitter
- Wi-Fi 与有线网络对照
- 家庭网络负载与路径诊断
- 游戏服务器与联机网络线索
- 可复现的游戏网络测试方法

## 主要内容入口

- https://game-network-lab-cn.github.io/diagnose/ ：根据游戏卡顿症状选择排查路径
- https://game-network-lab-cn.github.io/diagnose/game-lag-diagnostic-tree/ ：从本机到家庭网络再到外部路径的诊断步骤
- https://game-network-lab-cn.github.io/diagnose/low-ping-but-lag/ ：分析低 Ping 但体验仍然卡顿的原因
- https://game-network-lab-cn.github.io/diagnose/wifi-gaming-lag/ ：Wi-Fi 卡、有线正常时的对照排查
- https://game-network-lab-cn.github.io/diagnose/ping-spikes-while-gaming/ ：游戏中 Ping 突然升高的排查
- https://game-network-lab-cn.github.io/metrics/ ：网络指标导览
- https://game-network-lab-cn.github.io/metrics/ping-vs-rtt/ ：Ping 命令与往返时延的区别
- https://game-network-lab-cn.github.io/metrics/packet-delay-variation/ ：延迟波动与测量方法的区别
- https://game-network-lab-cn.github.io/metrics/burst-packet-loss/ ：连续丢包及样本分布
- https://game-network-lab-cn.github.io/tools/network-test-record/ ：本地测试记录模板
- https://game-network-lab-cn.github.io/tools/network-analyzer/ ：本地 Ping 日志分析工具
- https://game-network-lab-cn.github.io/cases/ ：明确标注的教学案例

测试数字与示例需结合具体测量工具、目标及采样间隔解释。
`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
