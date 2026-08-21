import type { APIRoute } from 'astro';

export const GET: APIRoute = () => new Response(`# 低延迟实验室

> 面向在线游戏玩家的网络测量、解释与故障定位知识站。

## 核心范围
- Ping 与 RTT
- Packet Loss 与突发丢包
- Packet Delay Variation / Jitter
- Wi-Fi、有线、家庭负载与路径对照
- 可复现的游戏网络诊断

## 内容边界
本站不提供优途客户端下载、安装、账号、连接或节点选择帮助。技术文章区分事实、推断和建议，不使用单一万能延迟阈值。
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
