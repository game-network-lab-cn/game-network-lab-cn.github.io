# 第十七轮：构建产物验收与交付状态

## 已完成

- 新增 `scripts/audit-dist.mjs`，在 Astro 构建后审查静态 HTML 路由、每页标题和描述、中文语言标识、唯一 main 地标、Canonical、内部链接、Sitemap、robots.txt、llms.txt 和 404 页面。
- `npm run build` 已改为先静态校验、执行 `astro check` 和 `astro build`，然后自动执行 `npm run audit:dist`；构建产物审计出错会阻止成功退出及后续发布。
- 新增构建产物模拟测试：完整页面集合应通过，故意制造的断链必须失败。
- 保持工具记录模板 `noindex` 策略不变，审计确保其不混入 sitemap。

## 实际验证情况

- `npm test`：34/34 通过。
- `npm run validate`：通过，识别到 8 条文章路由。
- `node --check scripts/audit-dist.mjs`：通过。
- `npm install`：失败，npm registry DNS 返回 `EAI_AGAIN`。
- **真实 Astro 生产构建及浏览器验收：未完成。** 新审计器已经用模拟构建产物测试，但未对实际 `dist/` 验收。

## 后续必须执行

在网络畅通的 Node.js 环境：

```bash
npm install
npm run verify
```

成功生成并提交 `package-lock.json` 后，将 `.github/workflows/deploy.yml` 的安装命令从 `npm install` 改为 `npm ci`，确保依赖可复现。然后用真实浏览器验证日志导入、A/B 对比、CSV 下载及移动端交互。不要把 34 项单元和静态测试等同于完整网站上线验收。
