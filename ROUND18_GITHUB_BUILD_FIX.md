# GitHub Actions Astro check: TS2305 / TS7006 修复

依据截图中的构建日志（network-analyzer.astro 第 80、175 行）：

- 源码 `src/lib/ping-analysis.mjs` 已导出 `troubleshootingSteps`，但 `src/lib/ping-analysis.d.mts` 遗漏同名导出声明，导致 Astro/TypeScript 依据声明文件报告 TS2305。
- 已为声明文件添加与运行时一致的 `troubleshootingSteps(samples, meta): string[]`。
- 已为 `steps.forEach` 回调参数显式标注 `string`，消除 TS7006。
- 新增测试确保实现与类型声明同时存在。

本地通过 npm test 和 npm run validate；由于当前环境尚无 Astro 依赖，未运行完整 astro check/astro build。截图中的 network-test-record.astro 提示为 warning/hint，不是导致本次退出码 1 的两个 error。

若 GitHub 仓库是由多个版本文件混合上传，请确保 `src/lib/ping-analysis.mjs`、`src/lib/ping-analysis.d.mts`、`src/pages/tools/network-analyzer.astro` 三个文件来自同一修复版本。GitHub Actions 的失败发生在提交 a818978；修复必须提交到目标部署分支才能生效。
