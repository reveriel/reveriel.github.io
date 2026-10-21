# BLTBLG v2 — 游戏作为知识的载体

> 传统的书本是**死**的——它在纸上等待你翻阅。如果你不思考，它不抗议；如果你的理解错了，它不纠正；如果你跳过困难的部分，它不在意。
>
> 游戏是**活**的——它需要你的参与，即时响应你的行动，根据你的表现调整难度。你必须**运用**知识才能通关，而不仅仅是"知道"。
>
> 这个博客的信仰是：**游戏是比死书本更先进的知识载体。**

---

## 目录

- [框架设计](#框架设计)
- [快速上手](#快速上手)
- [写一篇文章](#写一篇文章)
- [交互组件库](#交互组件库)
- [递进式难度设计](#递进式难度设计)
- [WASM / WebGPU / Shader](#wasm--webgpu--shader)
- [Pyodide — 在浏览器里跑 Python](#pyodide--在浏览器里跑-python)
- [目录结构参考](#目录结构参考)
- [FAQ](#faq)

---

## 框架设计

### 核心架构

```
你写的（作者界面）              框架自动处理的

content/posts/
  shader-intro/
    index.mdx        ──→    /posts/shader-intro/   (HTML 页面)
    demos/
      circle.wgsl    ──→    内嵌在页面里的交互组件
      sim.py         ──→    Pyodide 在读者浏览器里执行
      demo.rs        ──→    编译 → WASM → 按需加载

stage: 2              ──→   递进式难度分组
```

**这个博客就是一个目录 + 一个构建脚本。** 没有数据库，没有管理后台，没有黑盒。

### 作者界面

你用 **MDX** 写作——这是 Markdown 的超集，可以在文章里插入交互式组件：

```mdx
---
title: "SDF 入门"
date: 2026-07-23
stage: 2
tags: [graphics, shader]
summary: "用数学函数描述形状——比建模更本质的方式。"
---

## 什么是一个 SDF？

符号距离函数输入空间中的任意一点，输出它到最近表面的距离...

{/* 在这里插入交互式 Shader 编辑器 */}
<ShaderPlayground shader="./circle.wgsl" editable />

试着把 `length(p)` 改成 `p.x + p.y`，看看你画出了什么。
```

**你只需要掌握 MDX 语法（就是 Markdown + JSX 标签），其余的都是框架的事。**

### 设计原则

1. **文件即文章。** 一个目录 = 一篇文 = 一个自包含的知识单元。
2. **组件即交互。** 需要互动的地方，插入一个组件，而不是写一堆 `<script>` 标签。
3. **按需加载。** WASM、shader、Pyodide 只在真正需要时才加载，首页速度不受影响。
4. **纯静态输出。** `npm run build` 产出一堆 HTML，可以部署到任何地方。

---

## 快速上手

### 安装

```bash
npm install
npm run dev        # 启动开发服务器 → http://localhost:4321
```

### 创建新文章

```bash
npm run post:new   # 交互式输入 slug
# 或者手动：
mkdir -p src/content/posts/my-post/demos
touch src/content/posts/my-post/index.mdx
```

### 写文章

```mdx
---
title: "我的第一篇文章"
date: 2026-07-23
stage: 1
tags: [demo]
summary: "这是一篇示例文章。"
---

## 你好，世界

这是一段普通 Markdown。

```python
# 代码块，语法高亮自动处理
print("hello")
```

<QuizChain questions={[
  { text: "这篇文章讲了什么？", answer: "游戏化的知识传播" },
  { text: "你学会了吗？", answer: "是的" }
]} />
```

### 构建与部署

```bash
npm run build       # 产出在 dist/ 目录
npm run preview     # 本地预览构建结果
```

把 `dist/` 部署到 GitHub Pages、Cloudflare Pages、Vercel 或任何静态托管即可。

---

## 写一篇文章

### Frontmatter 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `date` | date | ✅ | 发布日期 |
| `draft` | boolean | 否 | 草稿不会出现在生产构建中 |
| `stage` | 1-5 | 否 | 难度等级，见下文 |
| `tags` | string[] | 否 | 标签 |
| `summary` | string | 否 | 简短摘要，显示在文章列表页 |

### 文章目录结构

```
src/content/posts/
  shader-intro/                  ← 目录名 = 文章 slug
    index.mdx                    ← 正文（唯一必需的文件）
    demos/                       ← 这篇文章专属的交互 demo
      circle.wgsl                ← 被 ShaderPlayground 引用的 shader
      attention-viz.ts           ← Canvas 2D demo 的脚本
      ml-sim.py                  ← Pyodide 跑的 Python 代码
    assets/                      ← 静态资源
      diagram.png
      model.glb                  ← 3D 模型
```

**目录名就是 URL。** `src/content/posts/shader-intro/` → `/posts/shader-intro/`。

---

## 交互组件库

所有组件都可以在 MDX 中直接使用（需要先 import）。以下是已实现的组件：

### `<ShaderPlayground>`

内嵌一个可编辑的 shader 编辑器 + 实时渲染预览。

```mdx
import ShaderPlayground from '@components/ShaderPlayground.astro'

<ShaderPlayground
  shader="./circle.wgsl"      {/* 相对于当前文章目录的 shader 路径 */}
  editable={true}             {/* 读者是否可以修改代码 */}
  initialParams={{            {/* shader uniform 初始值 */}
    color: [1.0, 0.5, 0.2],
    speed: 0.5,
  }}
/>
```

### `<CodeCell>`

可运行的代码单元格。支持 JS（原生）和 Python（通过 Pyodide）。

```mdx
import CodeCell from '@components/CodeCell.astro'

{/* JavaScript */}
<CodeCell lang="js">
  const v = new Float32Array([1, 2, 3])
  const norm = Math.sqrt(v.reduce((s, x) => s + x*x, 0))
  console.log("norm:", norm)
</CodeCell>

{/* Python (Pyodide — 自动加载) */}
<CodeCell lang="python">
  import numpy as np
  A = np.random.randn(100, 100)
  eigenvalues = np.linalg.eigvals(A)
  # @show eigenvalues[:5]
</CodeCell>
```

### `<WasmDemo>`

加载一个编译好的 WASM 模块并在 canvas 中运行。

```mdx
import WasmDemo from '@components/WasmDemo.astro'

<WasmDemo
  wasm="./path-tracer/pkg/pt_bg.wasm"
  js="./path-tracer/pkg/pt.js"
  canvasId="pt-canvas"
  width={600}
  height={400}
/>
```

### `<QuizChain>`

递进式问题链。答对解锁下一题，答错给提示。

```mdx
import QuizChain from '@components/QuizChain.astro'

<QuizChain
  checkpoint={true}   {/* localStorage 记住进度 */}
  questions={[
    {
      text: "SDF 的返回值表示什么？",
      options: [
        "点到表面的最近距离",
        "表面的颜色",
        "法线方向",
      ],
      answer: 0,
      hint: "S = Signed, D = Distance, F = Function"
    },
    {
      text: "要组合两个 SDF 表示的形状，应该用什么操作？",
      type: "text",
      answer: "min",
      hint: "取两个 SDF 的某个极值..."
    }
  ]}
/>
```

`type` 可以是 `"choice"`（选择题，默认）或 `"text"`（文字输入）。

### `<Simulation>`

交互式数学/物理模拟。Canvas 渲染，参数可拖拽。

```mdx
import Simulation from '@components/Simulation.astro'

<Simulation
  type="double-pendulum"   {/* 预设的模拟类型 */}
  params={{
    g: 9.8,
    m1: 1, m2: 1,
    l1: 1, l2: 1,
    theta1: Math.PI / 2,
    theta2: Math.PI / 4,
  }}
  editableParams={['m1', 'm2', 'l1', 'l2']}
/>
```

### `<ProofStep>`

可折叠的证明步骤。读者自行展开，按自己的节奏理解。

```mdx
import ProofStep from '@components/ProofStep.astro'

<ProofStep summary="证明：√2 是无理数">
  假设 √2 = p/q，其中 p, q 互质。

  那么 2 = p²/q²，即 p² = 2q²。

  所以 p² 是偶数，因此 p 是偶数。设 p = 2k。

  代入得 4k² = 2q²，即 q² = 2k²。

  所以 q² 是偶数，因此 q 是偶数。

  但 p 和 q 都是偶数，与假设"互质"矛盾。

  因此 √2 不能表示为有理数。∎
</ProofStep>
```

---

## 递进式难度设计

### Stage 系统

| Stage | 标签 | 含义 | 读者体验 | 文章特征 |
|-------|------|------|---------|---------|
| 🌱 1 | 入门 | 零基础可读 | 主要是阅读 + 看演示 | 不需要额外背景 |
| 🌿 2 | 基础 | 引入概念 | 开始有简单互动 | 建立在 Stage 1 的内容之上 |
| 🌳 3 | 进阶 | 知识开始组合 | 互动增加，有挑战题 | 需要组合多个知识点 |
| ⚡ 4 | 高阶 | 综合应用 | 主要靠互动和挑战 | 跨领域知识组合 |
| 🔥 5 | 前沿 | 开放探索 | 给方向而非答案 | 引导读者自己探索 |

### 渐进的互动密度

```
Stage 1:  90% 阅读 + 10% 演示
Stage 2:  70% 阅读 + 20% 交互 + 10% 挑战
Stage 3:  40% 阅读 + 40% 交互 + 20% 挑战
Stage 4:  20% 阅读 + 50% 交互 + 30% 挑战
Stage 5:  10% 方向 + 70% 自由探索 + 20% 你自己的项目
```

读者从"被展示知识" → "自己运用知识" → "自己创造知识"。

### 脚手架逐渐撤走

```
第 1 个挑战：完整 hint + 模板代码
第 2 个挑战：一半 hint + 部分代码
第 3 个挑战：只是方向 + 空白编辑器
```

这就是游戏设计的精髓——不是一下子给你所有难度，而是让你在每一次成功后都觉得自己可以挑战更难的。

---

## WASM / WebGPU / Shader

### Shader（WGSL / GLSL）

最简单的交互形式。用 `<ShaderPlayground>` 组件，shader 文件放在文章目录的 `demos/` 下：

```
shader-intro/
  index.mdx                    ← 引用 ./circle.wgsl
  demos/
    circle.wgsl                ← 你的 shader 代码
```

WGSL 是 WebGPU 的 shader 语言，GLSL 也可以通过 WebGL 使用。读者可以在浏览器中实时编辑 shader 并看到效果。

### Rust → WASM

每个需要 WASM 的文章目录下都有一个 Rust crate：

```
ray-tracing/
  index.mdx
  demos/
    demo/
      Cargo.toml
      src/
        lib.rs                ← wgpu / 计算逻辑
```

构建流程：

```bash
# 在文章目录下
cd src/content/posts/ray-tracing/demos/demo
wasm-pack build --target web --out-dir ../pkg

# 产物：demos/pkg/*.wasm, demos/pkg/*.js
```

`<WasmDemo>` 组件引用这些产物，在读者浏览器中按需加载。

### 性能考虑

| 技术 | 产物大小 (gzip) | 首屏加载 | 适用 |
|------|----------------|---------|------|
| WGSL shader | < 1KB | 即时 | 所有 GPU 可视化 |
| Canvas 2D + JS | 1-20KB | 即时 | 动画、图表 |
| wasm-bindgen | 50-200KB | ~0.3s | 中等计算 |
| wgpu (Rust) | 200KB-1MB | ~1s | Compute shader |
| Bevy (Rust) | 2-8MB | ~3-5s | 复杂 3D 场景 |
| Pyodide | 2-6MB | ~2-5s (缓存后即时) | Python 生态 |

所有重型资源都用 Intersection Observer 懒加载——只有滚动到可视范围时才初始化。

当 WebGPU 不可用时，组件自动降级到 Canvas 2D 或显示静态替代内容。

---

## Pyodide — 在浏览器里跑 Python

### 它能做什么

Pyodide 把 CPython 3.12 编译到了 WASM，所以读者浏览器里可以直接运行：

- `numpy` — 矩阵运算、线性代数
- `scipy` — 优化、积分、信号处理
- `sympy` — 符号计算（求导、积分、化简）
- `scikit-learn` — 轻量 ML
- `matplotlib` — 生成图表

### 使用方式

在 MDX 中用 `<CodeCell lang="python">`：

```mdx
<CodeCell lang="python">
  import sympy as sp
  x = sp.Symbol('x')
  expr = sp.sin(x)**2 + sp.cos(x)**2
  simplified = sp.simplify(expr)
  print(f"sin²(x) + cos²(x) = {simplified}")
</CodeCell>
```

### 它不能做什么

- **Manim** — 依赖 Cairo/FFmpeg，Pyodide 里没有
- **PyTorch / TensorFlow** — 太大，不适合浏览器
- **文件系统操作** — Pyodide 有虚拟 FS，但不能访问读者硬盘
- **高帧率 GPU 渲染** — 用 shader / wgpu 代替

### 性能

Pyodide 里的 numpy 大约比 native 慢 2-4 倍（对于中等规模运算足够）。首次加载 2-6 MB（gzip），浏览器缓存后秒开。

---

## 目录结构参考

```
blog/
├── README.md                   ← 你正在看的文件
├── package.json
├── astro.config.mjs            ← Astro + MDX 配置
├── tsconfig.json
│
├── public/                     ← 不经过构建的静态文件
│   └── favicon.svg
│
├── src/
│   ├── content/
│   │   ├── config.ts           ← 内容 schema 定义
│   │   └── posts/              ← 你的文章都在这里
│   │       ├── shader-intro/
│   │       │   ├── index.mdx
│   │       │   └── demos/
│   │       │       └── circle.wgsl
│   │       ├── transformer/
│   │       │   ├── index.mdx
│   │       │   └── demos/
│   │       │       ├── attention-viz.ts
│   │       │       └── sim.py
│   │       └── ... (你的其他文章)
│   │
│   ├── components/             ← 交互组件
│   │   ├── ShaderPlayground.astro
│   │   ├── CodeCell.astro
│   │   ├── WasmDemo.astro
│   │   ├── QuizChain.astro
│   │   ├── Simulation.astro
│   │   └── ProofStep.astro
│   │
│   ├── layouts/                ← 页面布局
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   │
│   ├── pages/                  ← 路由页面
│   │   ├── index.astro         ← /
│   │   ├── posts/
│   │   │   ├── index.astro     ← /posts
│   │   │   └── [...slug].astro ← /posts/xxx (自动路由)
│   │
│   └── styles/
│       └── global.css
│
└── dist/                       ← npm run build 产物（部署这个目录）
```

---

## FAQ

### 为什么不用 Hexo / Hugo / Next.js？

Hexo 和 Hugo 是静态站生成器——它们把 Markdown 翻译成 HTML，但**翻译完了知识就死了**。你要的交互需要的不是更好的 Markdown 解析器，而是一个**把交互式组件视为一等公民的框架**。

为什么不用 Next.js？因为你要的是 99% 静态 + 岛式交互，而不是全栈应用。Astro 的 islands 架构就是为这个场景设计的。

### 我需要会 React 吗？

不需要。Astro 组件用 `.astro` 模板语法——比 React 简单，更像 HTML + 模板表达式。MDX 里你可以直接用 Astro 组件标签，语法就是 HTML。

### 旧文章怎么迁移？

把旧的 `.md` 文件复制到 `src/content/posts/<slug>/index.mdx`，补充 frontmatter。现有的 Markdown 语法完全兼容。

### 我需要服务器吗？

不需要。`npm run build` 产出纯静态文件。托管到 GitHub Pages 或 Cloudflare Pages 就够了（免费）。

### 读者需要安装什么？

一个浏览器。Chrome / Firefox / Safari / Edge 都可以。WebGPU 需要较新版本，但框架有降级方案。

---

**这个博客是活着的。它等待的不是被动翻阅，而是主动参与。**
