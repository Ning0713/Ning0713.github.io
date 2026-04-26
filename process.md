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
