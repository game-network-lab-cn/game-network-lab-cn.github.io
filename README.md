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

仓库地址：

https://github.com/game-network-lab-cn/game-network-lab-cn.github.io

网站地址：

https://game-network-lab-cn.github.io/

本站长期使用 GitHub Pages 提供的域名，不绑定自定义域名，也不需要配置 DNS 或 CNAME。

## 本地运行

需要 Node.js 24 或以上版本。

常用命令：

- 安装依赖：`npm install`
- 启动开发环境：`npm run dev`
- 检查并构建：`npm run build`
- 预览生产结果：`npm run preview`

## 自动部署

提交到 `main` 分支后，GitHub Actions 会自动执行：

1. 安装依赖
2. 执行项目校验
3. 执行 Astro 类型检查
4. 构建静态网站
5. 上传 GitHub Pages 产物
6. 部署网站
7. 部署成功后通知 IndexNow

工作流文件：

- `.github/workflows/deploy.yml`
- `.github/workflows/indexnow.yml`

## 发布后检查

每次更新后应确认：

- `Deploy to GitHub Pages` 工作流成功
- `Notify IndexNow` 工作流成功
- 首页和文章页面可以访问
- robots.txt 可以访问
- sitemap.xml 可以访问
- Canonical 使用正式 GitHub Pages 地址
- 内部链接没有旧的 `/game-network-lab/` 路径
- 移动端导航、表格和表单显示正常

## 内容边界

本站不负责：

- 优途品牌入口
- 优途官方下载
- 客户端安装教程
- 账号与登录问题
- 客户端连接问题
- 节点选择
- 优途客户端故障排查

这些内容分别属于优途官方入口站和优途使用帮助中心。

本站不自行发布未经重新核验的价格、套餐、节点数量、活动、下载版本或系统支持信息。

## 隐私

网络测试记录模板仅在浏览器本地运行，不提交用户填写的数据。

公开诊断材料前，应遮盖：

- 完整公网 IP
- 账户名
- 设备序列号
- Wi-Fi 密码
- 访问令牌
- 不必要的网络标识
