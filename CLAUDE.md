# Reveriel · Interactive Knowledge

域名: www.reveriel.com
仓库: reveriel/reveriel.github.io (单仓库，既是源文件又是 GitHub Pages 部署)

## 项目定位

不是技术博客，是交互式知识系统。核心理念：**游戏是比死书本更先进的知识载体。**
知识通过互动、渐进难度、实时反馈来学习，而不是单向阅读。
随着 ai 的发展，ai 构建新知识新项目的速度会指数级爆炸，但是人类的理解不可以被替代。

涵盖: Graphics, LLM, Computer Vision, Math, Physics — 全部带交互式 demo。

## 技术栈

- Astro 5 + MDX（静态生成，零服务器）
- WebGPU / WGSL shader（ShaderPlayground）
- WASM via wasm-pack（Rust → 浏览器）
- Pyodide（浏览器内 Python + numpy/scipy/sympy）
- Shiki 语法高亮，KaTeX 未来用于数学渲染
- Giscus 评论（GitHub Discussions 驱动）

## 关键文件

```
astro.config.mjs          — site URL, MDX 配置
src/content/config.ts     — frontmatter schema (title, date, stage, locale, tags, summary)
src/i18n/ui.ts            — 中英文 UI 字符串
src/layouts/BaseLayout.astro  — HTML shell, OG/twitter tags, nav, footer, 语言切换
src/layouts/PostLayout.astro  — 文章页包装: stage badge, hreflang, Giscus
src/components/           — 交互式组件库
src/pages/                — 中文路由
src/pages/en/             — 英文路由
public/CNAME              — www.reveriel.com
.github/workflows/deploy.yml — GitHub Actions 自动部署
archive/                  — Hugo 旧文章（未迁移）
```

## 内容规范

每篇文章是一个目录：
```
src/content/posts/<slug>/
  index.mdx    ← 中文（默认，locale: zh-CN）
  en.mdx       ← 英文（可选，locale: en）
  demos/       ← 属于这篇文章的代码资源
```

Frontmatter 关键字段:
- `stage: 1-5` — 递进难度
- `locale: zh-CN | en` — 默认为 zh-CN
- `summary:` — 用于 SEO description 和 OG tags

## i18n

URL 判断语言: `/en/...` → 英文，其余 → 中文。中英文各自有独立的路由文件。
中英文文章各占一条路由，locale 字段决定归属。

## 部署

单仓库 + GitHub Actions + GitHub Pages:
1. push 到 master → Actions 自动 `npm ci && npm run build`
2. `actions/upload-pages-artifact` + `actions/deploy-pages` 部署
3. Settings → Pages → Source: GitHub Actions, Custom domain: www.reveriel.com
4. DNS: www CNAME → reveriel.github.io

## 已知问题

1. **数学 LaTeX 渲染**: 含 `$` 和 `$$` 的旧文章留在 `archive/`。MDX 中的 `{` `}` 被 acorn 解析为表达式导致构建失败。remark-math + rehype-katex 尝试过但不兼容当前 Astro MDX 版本。需要找到可行的构建时或客户端渲染方案才能迁移 archive/ 中的数学文章。

2. **WASM Mandelbrot**: Rust 源码在 `src/content/posts/hello-interactive-world/demos/mandelbrot/`，但 `wasm-pack build` 未成功（wasm 目标平台下载失败）。WasmDemo 组件有完整 JS fallback，不影响使用。

3. **OG 图片**: `og-default.png` 引用已生成但图片不存在，放在 `public/og-default.png` (1200×630)。

4. **Giscus 评论**: 未配置。在 GitHub repo Settings → Discussions 开启，安装 Giscus App，在 `.env` 填 `GISCUS_REPO`, `GISCUS_REPO_ID`, `GISCUS_CATEGORY`, `GISCUS_CATEGORY_ID`。

5. **Simulation 组件**: 只有 placeholder，实际的物理模拟（双摆、波动）未实现。

## 旧文章

- `archive/` 中 28 篇 Hugo 格式旧文
- 10 篇无数学公式的已迁移到 `src/content/posts/`
- 16 篇含数学公式的等待数学渲染方案就绪
- Hugo 残留: `config.toml`, `themes/hugo-primer/`, `resources/` — 可安全删除

## 下一步

- sitemap.xml + RSS (`@astrojs/sitemap`, `@astrojs/rss`)
- 第一篇真正的交互式文章（Shader 入门或线性代数可视化）
- 数学渲染方案 → 迁入 archive 文章
- WebGPU compute shader
- 读者进度追踪 (localStorage)
- json-ld 结构化数据
