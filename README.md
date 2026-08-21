# 低延迟实验室

低延迟实验室是面向在线游戏玩家的网络测量、指标解释与故障定位知识站。

网站地址：

https://game-network-lab-cn.github.io/

## 网站内容

本站主要介绍：

- Ping 与 RTT
- 丢包与突发丢包
- 延迟波动与 Jitter
- Wi-Fi 与有线网络差异
- 家庭网络负载
- 路由与 ISP 路径线索
- 游戏服务器与联机网络问题
- 可复现的网络测试方法

网站还提供按症状选择的诊断入口、分步骤排查指南和本地网络测试记录模板。

## 技术结构

项目使用 Astro 构建静态网站，并通过 GitHub Actions 部署到 GitHub Pages。

主要目录：

```text
public/                 静态图片与公开资源
scripts/                项目校验和发布辅助脚本
src/components/         页面公共组件
src/data/               文章与站点数据
src/layouts/            页面布局
src/pages/              页面和公开文本端点
src/styles/             全站样式
