# 低延迟实验室

游戏网络质量测量、解释与故障定位知识站。项目使用 Astro 静态输出，为 GitHub Pages 配置。

## 首发内容

- 6 篇核心内容：2 篇诊断指南、4 篇指标说明
- 首页症状选择器与三步诊断流程
- 本地网络测试记录模板（`noindex`，不提交数据）
- 关于、编辑方法、内容政策、隐私与 404 页面
- Canonical、Open Graph、JSON-LD、robots.txt、sitemap.xml、llms.txt
- Pages 成功部署后自动读取 Sitemap 并通知 IndexNow

## 本地运行

需要 Node.js 24 或以上版本。

```bash
npm install
npm run dev
```

生产检查与构建：

```bash
npm run build
npm run preview
```

## 第一次发布到 GitHub Pages

1. 把项目根目录的全部文件上传到 `game-network-lab-cn/game-network-lab` 仓库根目录。
2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment → Source** 选择 **GitHub Actions**。
4. 打开 **Actions**，等待 `Deploy to GitHub Pages` 变为绿色。
5. 初始地址应为 `https://game-network-lab-cn.github.io/game-network-lab/`。

仓库当前不是 `game-network-lab-cn.github.io` 这个特殊名称，因此初始部署必须保留 `/game-network-lab/` 基础路径。项目已自动处理内部链接、图片、Canonical、robots 与 Sitemap。

## 后续绑定自定义域名

等 DNS 已经准备好后再操作：

1. 在仓库 **Settings → Secrets and variables → Actions → Variables** 新建变量：
   - Name: `PUBLIC_SITE_URL`
   - Value: `https://netlab.youtujsq9.net`
2. 在 GitHub Pages 设置中填写自定义域名并按 GitHub 提示配置 DNS。
3. 域名验证完成后，再在 `public/` 新增 `CNAME` 文件，内容只写 `netlab.youtujsq9.net`。
4. 重新运行部署，检查 Canonical、Sitemap 和内部链接全部切换到新域名。

初次上传包没有 `CNAME`，这是有意设计，避免域名尚未配置时阻断 Pages 部署。

## 发布后人工检查

- 首页和 6 篇内容返回 200，404 页面正常。
- `robots.txt` 中 Sitemap 地址可访问。
- `sitemap.xml` 只包含可索引页面，不包含记录模板。
- 页面源代码中 Canonical 与实际公开地址一致。
- 在手机上检查导航、表格横向滚动和模板字段。
- 配置 Google Search Console 与 Bing Webmaster Tools 后再提交 Sitemap。
- 不要把提交 Sitemap 等同于完成收录；上线后按真实搜索需求更新内容。

## 内容边界

本站不负责优途品牌入口、下载、安装、账号、连接、节点选择或优途客户端故障。产品价格、套餐、节点、活动和下载版本不得从本项目旧内容推断，应重新核验优途当前官网。
