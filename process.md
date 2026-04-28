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

## 2026-04-28 下一次对话快速入口

- 先读下面的 `2026-04-28 当前上下文快照`，这是最新完整交接记录。
- 当前最重要的实际状态：
  - `astro.config.mjs` 已修复 GitHub Pages 裸 HTML / CSS 丢失风险，资源目录为 `assets`，且生成资源文件名不再以 `_` 开头。
  - `BaseLayout.astro` 控制全站导航、首页/内页布局、文章页 `highlightColor` 背景过渡；当前文章页渐变实际是到 `95%` 混到 `--color-paper`。
  - `global.css` 控制首页金色淡渐变、导航黑色文字、主题按钮颜色。
  - `ContentLayout.astro` 控制文章详情页 Axi 风格头图、模糊虚影、标题、元信息与右侧目录。
  - `BlogExplorer.astro` 控制 Blog 列表卡片、右侧 Collections/Tags、collection 详情 hero 和文章列表。
- 如果下一次继续调文章页过渡，优先改 `src/layouts/BaseLayout.astro` 中 `site-highlight-gradient` 的 inline `linear-gradient(...)`。
- 如果下一次继续处理线上裸 HTML，优先确认 GitHub Pages Source 为 `GitHub Actions`，并确认最新 commit 已包含 `astro.config.mjs` 的资源命名修复。

## 2026-04-28 当前上下文快照

- 工作目录仍为：`F:\All 资源集合\Coding 代码\开发工程 Engine\Ning0713.github.io`。
- 技术栈：Astro 5 + Tailwind CSS + MDX/Markdown + KaTeX。
- 参考方向：继续参考 Axi / Axi-Theme 的极客、学者型个人站风格，但除非明确要求，不要大幅改动当前主页整体结构。
- 用户偏好：Codex 负责本地修改与验证；部署、提交、push 由用户自己执行。
- `.env` 被 `.gitignore` 忽略，里面涉及隐私密钥，不要提交、不要把密钥写入文档。线上 GitHub 贡献热力图等需要密钥时，应使用 GitHub Actions Secret：`GH_CONTRIBUTION_TOKEN`。

## 2026-04-28 关键已实现状态

- `astro.config.mjs` 已针对 GitHub Pages 样式丢失问题做过修复：
  - `build.assets` 设置为 `assets`，避免默认 `_astro` 资源目录被 Pages/Jekyll 场景吞掉。
  - Vite `assetFileNames` 额外去除生成资源文件名开头的 `_`，例如把 `/assets/_category_.xxx.css` 改为 `/assets/category_.xxx.css`。
  - 根目录和 `public/` 下都有 `.nojekyll`。
- 如果线上再次出现“页面只有裸 HTML、CSS 没加载”的情况，优先检查：
  - GitHub 仓库 `Settings -> Pages -> Build and deployment -> Source` 是否为 `GitHub Actions`。
  - Actions 页面是否运行的是 `Deploy to GitHub Pages`，而不是默认 `Build with Jekyll`。
  - 最新 commit 是否包含 `astro.config.mjs` 的 Pages 资源命名修复。
- 当前 GitHub Pages 工作流：`.github/workflows/deploy.yml`，使用 `withastro/action@v6` 构建并通过 `actions/deploy-pages@v5` 发布。

## 2026-04-28 当前样式状态

- 首页顶部背景渐变在 `src/styles/global.css`：
  - 当前为更金色的暖黄色系，变量为 `--color-top-gradient-start: 236 178 40` 和 `--color-top-gradient-end: 255 216 92`。
  - 首页只在 `body.is-home-page::before` 上显示很淡的金色过渡，不再使用粉紫色光晕。
- 导航栏文字已改为黑色系：
  - `BaseLayout.astro` 中导航链接的 hover / active 类已改为 `text-ink`。
  - `global.css` 中 `.site-primary-nav` 和 `.theme-toggle-button` 默认也改为 `rgb(var(--color-ink))`。
- 导航栏滚动收缩逻辑仍在 `BaseLayout.astro` 内联脚本：
  - `compactAt = 96`
  - `expandAt = 48`
  - 这个滞后区间用于避免滚动一点点时导航栏反复抖动。
- 文章页顶部颜色过渡由 `BaseLayout.astro` 的 `site-highlight-gradient` 控制：
  - 当前实际写法为：

```astro
linear-gradient(${highlightColor} 0%, rgb(var(--color-paper) / 0.94) 95%, transparent 100%)
```

## 2026-04-28 文章详情页状态

- 文章详情页布局文件：`src/layouts/ContentLayout.astro`。
- 详情页已参考 Axi-Theme 实现：
  - 顶部文章头图。
  - 头图右后方模糊虚影。
  - 文章元信息行：发布时间、更新时间、阅读时长、Hero Image 来源、标签。
  - 标题与描述靠近 Axi 风格，标题尺寸已压缩过，目标是首屏能看到一部分正文。
  - 正文 + 右侧目录双栏布局保留。
- 文章页背景色来自 frontmatter 的 `coverColor`，通过 `ContentLayout.astro` 传给 `BaseLayout` 的 `highlightColor`。
- Axi-Theme 的颜色逻辑是手动配置颜色，不是自动从图片提取；本项目也采用手写 `coverColor` 的方式。
- 支持的文章 frontmatter 字段见 `src/content/config.ts`，当前包括：
  - `cover`
  - `coverAlt`
  - `coverSource`
  - `coverColor`
  - `collection`
- 示例文章：
  - `src/content/blog/technical/章节疑难点(1) Transformer 架构.md`
  - `src/content/blog/technical/章节疑难点(2) 预训练语言模型.md`
- Pixiv 页面链接不能直接当图片 `cover` 用；应先上传到 ImgBB 等图床，再使用图片直链。

## 2026-04-28 Blog 与 Collection 状态

- Blog 列表主组件：`src/components/BlogExplorer.astro`。
- Blog 列表已改成偏 Axi 风格：
  - 左侧文章卡片列表。
  - 右侧 Collections / Tags。
  - 文章卡片、标签、collection 入口使用圆角胶囊或圆角卡片。
  - 文章卡片 cover 作为右侧背景图，不再撑高卡片。
  - 文章卡片点击范围已扩展到右侧封面区域；标签与 collection 胶囊仍保留独立链接。
- Collection 元数据目录：`src/content/postCollections/`，当前有 `深度学习.md`。
- Collection 详情路由已补齐：
  - `src/pages/collection/[collection].astro`
  - `src/pages/collection/[collection]/page/[page].astro`
- Collection 详情页只保留 collection hero 与文章列表两块主要内容，右侧 sidebar 在 collection 详情模式下隐藏。
- Collection hero 支持 cover 图片，样式参考 Axi 的图片卡片；如果图片不显示，优先检查 `postCollections` markdown 的 `cover` 是否为公网图片直链。

## 下次对话建议入口

- 如果继续调文章页顶部过渡：先看 `src/layouts/BaseLayout.astro` 中 `site-highlight-gradient` 的 inline `linear-gradient(...)`。
- 如果继续调文章详情页头图、标题、正文首屏露出：先看 `src/layouts/ContentLayout.astro`。
- 如果继续调 Blog 列表、文章卡片、右侧 collection/tag 胶囊：先看 `src/components/BlogExplorer.astro`。
- 如果继续调 collection 页面：先看 `src/pages/collection/[collection].astro` 与 `src/components/BlogExplorer.astro` 的 `collectionHero` 分支。
- 如果继续调部署裸 HTML 问题：先看 `astro.config.mjs`、`.github/workflows/deploy.yml`、`.nojekyll`、`public/.nojekyll`。
- 常规本地验证：

```powershell
npm run build
```

- 常规发布仍由用户执行：

```powershell
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

## 2026-04-26 本轮对话记录

- 参考来源：继续参考 `https://axi404.top/`、主题指南 `https://theme.axi404.top/blog/axi-theme-basics`，以及本地原作者仓库 `F:\All 资源集合\Coding 代码\开发工程 Engine\Axi-Theme`。
- 主页保持现状：后续参考 Axi-Theme 改动时，不主动改动当前已实现的主页。
- Blog 列表页继续向 Axi 风格靠拢：文章卡片改为更窄的双栏布局，左侧文章列表、右侧 Collections / Tags；卡片、标签、collection 入口都采用胶囊或圆角卡片形式。
- Blog 文章卡片已支持 `cover` frontmatter 字段，用于列表卡片右侧背景图。推荐写法是直接使用图床直链，例如 `https://i.ibb.co/...jpg`。
- Pixiv 这类页面链接，例如 `https://www.pixiv.net/artworks/140368429`，不能直接作为 `cover` 图片使用；需要先下载/授权确认后上传到 ImgBB 等图床，再使用实际图片直链。
- PicGo Windows 安装包应选择 `PicGo-2.5.3-x64.exe`；`.blockmap` 是更新元数据，`AppImage` 是 Linux 版本。
- 当前示例文章 `src/content/blog/technical/章节疑难点(1) Transformer 架构.md` 使用了：

```md
cover: https://i.ibb.co/pvsdp7LP/20260426165138.jpg
```

- 文章卡片封面图已改为绝对定位填充在卡片右侧，不再把卡片撑高；移动端会退化为顶部横向封面。
- 本轮最后修改：文章卡片的“进入文章”点击范围已从原来的文字/箭头区域扩大到整张卡片最右侧和封面区域；标签与 collection 胶囊仍保留自己的独立点击链接。
- 文章详情页目录已调整：目录行距进一步压缩；上级目录标题右侧有小三角按钮；默认打开文章时子目录全部收束，点击三角可展开/折叠。
- 本轮验证：已运行 `npm.cmd run build`，结果为 `0 errors / 0 warnings / 0 hints`，共生成 14 个页面。
- 部署、提交、push 由用户自己完成；Codex 只负责本地修改和验证，不主动发布。

## 下一次对话背景信息

- 工作目录：`F:\All 资源集合\Coding 代码\开发工程 Engine\Ning0713.github.io`
- 优先查看文件：
  - `src/components/BlogExplorer.astro`：Blog 列表、文章卡片、封面图、collection/tag 胶囊入口。
  - `src/components/TableOfContents.astro`：文章详情页右侧目录、折叠逻辑、目录行距。
  - `src/content/blog/technical/章节疑难点(1) Transformer 架构.md`：当前用于测试封面图的文章。
  - `src/content/config.ts`：如果新增 frontmatter 字段，需要先确认 schema。
- 如果继续调试图片显示，先确认 frontmatter 顶部没有空行，`cover` 是可公网访问的图片直链，并运行 `npm run build` 或强制构建确认 `dist/blog/index.html` 中是否出现对应图片 URL。
- 如果继续调整文章展示界面，保持“主页不动”，优先改 `BlogExplorer.astro` 及其局部 CSS。
- 常规验证命令：

```powershell
npm run build
```

- 常规发布流程仍然由用户执行：

```powershell
git status
git add .
git commit -m "Update site"
git push
```
