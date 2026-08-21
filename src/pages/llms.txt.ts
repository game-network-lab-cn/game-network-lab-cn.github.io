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

## 内容原则

- 区分观察事实、合理推断和操作建议
- 不使用适用于所有游戏和网络环境的单一延迟阈值
- 不凭一次测速或一张路由截图确定问题责任
- 优先参考标准组织、官方技术文档和可复现测量
- 涉及诊断时，优先从本机和家庭网络开始逐层排查

## 内容边界

本站不提供特定网络加速产品的下载、安装、账户、套餐或客户端操作支持。网络知识与诊断内容可以脱离产品推荐独立使用。
`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
