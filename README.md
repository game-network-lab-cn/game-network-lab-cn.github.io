# 低延迟实验室

低延迟实验室是面向在线游戏玩家的网络测量、指标解释与故障定位知识站。

网站地址：

https://game-network-lab-cn.github.io/

## 网站定位

本站主要解释和诊断：

- Ping 与 RTT
- Packet Loss 与突发丢包
- Packet Delay Variation / Jitter
- Wi-Fi 与有线网络差异
- 家庭网络负载
- 路由与 ISP 路径线索
- 游戏服务器与联机网络问题
- 可复现的网络测试方法

## 首发内容

- 6 篇核心内容
- 2 篇诊断指南
- 4 篇指标说明
- 首页症状选择器
- 三步诊断流程
- 本地网络测试记录模板
- 关于、编辑方法、内容政策和隐私页面
- 自定义 404 页面

## SEO 与 GEO

项目已配置：

- Title 与 Meta Description
- Canonical
- Open Graph
- JSON-LD Schema
- Breadcrumb
- robots.txt
- sitemap.xml
- llms.txt
- IndexNow
- 响应式布局
- 基础性能优化

## 技术结构

项目使用 Astro 静态构建，并通过 GitHub Actions 自动部署到 GitHub Pages。

仓库：

https://github.com/game-network-lab-cn/game-network-lab-cn.github.io

正式地址：

https://game-network-lab-cn.github.io/

本站长期使用 GitHub Pages 提供的域名，不绑定自定义域名，也不需要配置 DNS 或 CNAME。

## 本地运行

需要 Node.js 24 或以上版本。

```bash
npm install
npm run dev
