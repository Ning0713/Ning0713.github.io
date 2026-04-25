# Process

## 当前项目概况

- 项目路径：`F:\All 资源集合\Coding 代码\开发工程 Engine\Ning0713.github.io`
- 技术栈：Astro 5 + Tailwind CSS + MDX/Markdown + KaTeX
- 参考目标：继续向 `https://axi404.top/` 的极客/学者型个人网站靠拢
- 线上目标：GitHub Pages 用户站点 `https://ning0713.github.io`
- 当前 Git 分支：`main`
- 首次本地提交：`9858760 Initial Astro personal site`

## 当前功能状态

- 首页已定制，包含头像卡片、About、Education、Statistics、GitHub 贡献热力图。
- 主导航顺序固定为：Blog / Projects / Academic / Links / About。
- Blog 是一级下拉导航，栏目为：Technical / Life and Talk / Journal。
- 内容集合已配置：`blog`、`academic`、`projects`。
- 多层内容路由使用 `[...,slug]`，可承接更深目录。
- Blog 已支持栏目页、标签页、分页、自定义 collection 分类页。
- 自定义内容分类字段为 `collection`，当前 `Happy-LLM` 文章归入“深度学习”。
- 内容详情页已使用“正文 + 右侧目录”双栏布局。
- `about.astro` 已改为章节化长页。
- 目录组件支持树形嵌套、滚动高亮、桌面 sticky、移动端正文前展示。
- Markdown 数学公式已接入 `remark-math + rehype-katex + katex`。
- `remark-content-fixes.mjs` 目前主要处理 Obsidian 图片语法，不再自行接管公式。
- GitHub 贡献热力图按 2026 年生成，依赖 `GITHUB_USERNAME`、`GITHUB_TOKEN`、`GITHUB_CONTRIBUTION_YEAR`。

## 关键文件

- `astro.config.mjs`：Astro 集成、KaTeX、站点 URL、Markdown 处理链。
- `src/layouts/BaseLayout.astro`：全站基础布局、导航、主题切换、滚动吸顶导航。
- `src/layouts/ContentLayout.astro`：文章/项目/学术详情页正文与目录双栏布局。
- `src/components/TableOfContents.astro`：目录树、目录样式、滚动高亮。
- `src/components/BlogExplorer.astro`：Blog 列表主界面。
- `src/lib/blog.ts`：Blog 分页、分类、标签、collection 汇总逻辑。
- `src/lib/content.ts`：日期排序、slug 去重等通用内容工具。
- `src/lib/github.ts`：GitHub GraphQL 贡献热力图数据获取。
- `src/lib/remark-content-fixes.mjs`：Obsidian 图片语法兼容处理。
- `src/content/config.ts`：内容集合 schema。
- `.github/workflows/deploy.yml`：GitHub Pages 自动部署工作流。
- `.gitignore`：已忽略 `.env`、`node_modules`、`dist`、`.astro`。

## 部署状态

- 本地已初始化 Git，并完成首个提交。
- 本地 `npm run build` 已通过，结果为 `0 errors / 0 warnings / 0 hints`。
- `.github/workflows/deploy.yml` 已创建，使用 GitHub Actions + `withastro/action` 部署 Astro 站点。
- GitHub Pages 如果出现 `Build with Jekyll`，说明 Pages 仍在使用默认 branch/Jekyll 构建，需要到仓库 `Settings -> Pages -> Build and deployment -> Source` 改为 `GitHub Actions`。
- 正确运行时，Actions 页面应看到 `Deploy to GitHub Pages`，而不是 `pages build and deployment` 里的 `Build with Jekyll`。
- 后续常规发布流程：

```powershell
npm run build
git status
git add .
git commit -m "Update site"
git push
```

## GitHub Pages 必要设置

- 仓库名应为：`Ning0713.github.io`
- Pages Source 应设置为：`GitHub Actions`
- Actions Secret 建议添加：

```text
Name: GH_CONTRIBUTION_TOKEN
Value: GitHub Personal Access Token
```

- `.env` 中曾出现真实 GitHub token。不要提交 `.env`；若 token 曾暴露，建议在 GitHub 里 revoke 并重新生成。

## 已知问题与处理经验

- PowerShell 显示中文路径或中文文件名时可能乱码，不一定代表源码损坏。
- Astro/Vite 偶尔会命中旧缓存，导致 `dist` 与源码不一致；必要时执行强制构建：

```powershell
.\node_modules\.bin\astro.cmd build --force
```

- 文章详情页曾出现相同 slug 内容覆盖问题，已通过 `dedupeEntriesBySlug` 在集合入口处去重。
- `Happy-LLM` 文章中过去有公式被 Markdown 强调语法误解析的问题；当前已改用 KaTeX 标准链路。
- 如果 Git commit 触发 GPG 错误，可临时使用：

```powershell
git -c commit.gpgsign=false commit -m "Update site"
```

## 压缩时间线

- 2026-04-23：建立 Astro + Tailwind 个人站基础结构，完成首页、导航、主题切换、滚动吸顶导航。
- 2026-04-23：重构 Blog 信息架构，接入栏目、标签、分页、自定义 collection 分类与 `/collection` 页面。
- 2026-04-24：对照 `axi404.top` 增加详情页右侧目录、章节化 About 页和更接近参考站的长文布局。
- 2026-04-24：收紧目录字号与行距，改为树形嵌套；处理 Markdown 渲染问题。
- 2026-04-24：安装并接入 `remark-math + rehype-katex + katex`，公式渲染切换到标准 KaTeX 管线。
- 2026-04-25：新增 `.gitignore` 和 GitHub Pages Actions 工作流，初始化 Git 仓库并完成首个提交。

## 下一步建议

- 继续完善 Projects 和 Academic 列表页，使其更接近参考站的信息架构。
