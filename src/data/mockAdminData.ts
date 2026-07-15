export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string; // Markdown article content
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  views: number;
  likes?: number; // Like count from D1
  comments: number;
  gradient: string;
  thumbnailType: "mesh" | "starfield" | "aurora" | "vortex";
  status: "published" | "draft";
  coverImage?: string; // Custom uploaded article cover image
  created_at?: string; // 数据库创建时间
  updated_at?: string; // 数据库最后修改时间
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  category: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  date: string;
  glowColor?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  count: number;
}

export interface Category {
  id: string;
  title: string;
  desc: string;
  colorName: string;
  iconType?: "laptop" | "server" | "cloud" | "palette" | "pen-tool" | "wrench" | "brain" | "globe" | "cpu" | "terminal" | "flame" | "sparkles" | "rocket";
}

export interface SiteSettings {
  nickname: string;
  title: string;
  avatarUrl: string;
  bio: string;
  siteTitle: string;
  siteSlogan: string;
  siteDescription: string;
  github: string;
  twitter?: string;
  mail: string;
  homeImage?: string;
  location?: string;
  siteSloganEn?: string;
  siteNotice?: string;
  categoriesTitle?: string;
  categoriesSubtitle?: string;
  categoriesTitleEn?: string;
  categoriesSubtitleEn?: string;
  tagsTitle?: string;
  tagsSubtitle?: string;
  tagsTitleEn?: string;
  tagsSubtitleEn?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroTitleEn?: string;
  heroSubtitleEn?: string;
  articlesTitle?: string;
  articlesSubtitle?: string;
  articlesTitleEn?: string;
  articlesSubtitleEn?: string;
  // 关于页 - 统计卡片
  aboutStatsValue1?: string;
  aboutStatsLabel1?: string;
  aboutStatsLabel1En?: string;
  aboutStatsValue2?: string;
  aboutStatsLabel2?: string;
  aboutStatsLabel2En?: string;
  aboutStatsValue3?: string;
  aboutStatsLabel3?: string;
  aboutStatsLabel3En?: string;
  // 关于页 - 技术栈与写作方向
  aboutFocusTitle?: string;
  aboutFocusTitleEn?: string;
  aboutFocus1Title?: string;
  aboutFocus1TitleEn?: string;
  aboutFocus1Desc?: string;
  aboutFocus1DescEn?: string;
  aboutFocus2Title?: string;
  aboutFocus2TitleEn?: string;
  aboutFocus2Desc?: string;
  aboutFocus2DescEn?: string;
  aboutFocus3Title?: string;
  aboutFocus3TitleEn?: string;
  aboutFocus3Desc?: string;
  aboutFocus3DescEn?: string;
}

// Initial pre-populated data for standard synchronization
export const INITIAL_ARTICLES: Article[] = [
  {
    id: "cloudflare-deploy",
    title: "使用 Cloudflare 部署全栈应用",
    summary: "Cloudflare 不仅仅是一个 CDN。现在，就让我们利用 Pages、Workers 以及 D1/KV 数据库来搭建并部署一个极速、弹性、完全免费的现代全栈博客应用。本篇深度长文将带你完成全部链路...",
    content: `# 使用 Cloudflare 部署全栈应用

Cloudflare 不仅仅是一个 CDN。现在，就让我们利用 Pages、Workers 以及 D1/KV 数据库来搭建并部署一个极速、弹性、完全免费的现代全栈博客应用。

## 1. 为什么选择 Cloudflare?

在传统的全栈应用中，我们需要租用云服务器（EC2 等），配置 Nginx、安装数据库并自行运维。这带来了以下几个痛点：
* **高昂成本**：即便应用无人访问，虚拟机也在默默计费。
* **网络延迟**：服务器通常托管在单一可用区，跨国访问速度难以保障。
* **复杂的运维**：SSL 证书续签、负载均衡、数据库备份、DDoS 防御。

而 Cloudflare 的 **Serverless 边缘计算架构** 彻底颠覆了这一切：
* **全球边缘节点**：你的代码和静态文件会分发至 CF 全球 300 多个数据中心，实现毫秒级响应。
* **极致低成本**：每日 10 万次 Workers 免费额度，D1 数据库和 KV 均包含慷慨的免费额度。
* **零运维成本**：内置一键 SSL、极致防护、自动扩缩容，免除部署烦恼。

---

## 2. 极速 Cloudflare Pages 部署

Cloudflare Pages 是专门为全栈和静态前端项目打造的托管平台。你可以直接关联 GitHub 仓库进行自动化 CI/CD 构建：

1. 登录 Cloudflare 控制台，点击 **Workers 和 Pages**。
2. 点击 **创建应用程序**，选择 **Pages** 选项卡。
3. 连接你的 GitHub 账号，并选择你要部署的项目。
4. 在构建配置中，选择对应的框架模板（例如 \`Next.js (Static Export)\` 或 \`Vite\`）。
5. 点击 **保存并部署**。
`,
    date: "2026-05-20",
    category: "Cloudflare",
    tags: ["Cloudflare", "部署", "Next.js", "TypeScript"],
    readTime: "8分钟阅读",
    views: 1240,
    comments: 18,
    gradient: "from-blue-600/30 via-indigo-500/20 to-purple-600/30",
    thumbnailType: "starfield",
    status: "published",
  },
  {
    id: "high-perf-blog",
    title: "从零构建一个高性能 Blog",
    summary: "极致的渲染速度与像素级还原是高端美学的底线。本文深入剖析如何使用 Vite 的深度打包策略、资源预加载、骨架屏微动效以及 Tailwind 极简主题机制，将 Lighthouse 评分稳稳锁定在 100 分...",
    content: `# 从零构建一个高性能 Blog

极致的渲染速度与像素级还原是高端美学的底线。本文深入剖析如何使用 Vite 的深度打包策略、资源预加载、骨架屏微动效以及 Tailwind 极简主题机制。

## 1. Lighthouse 满分攻略
要让我们的博客网页实现极致的性能，必须优化三个核心指标（Core Web Vitals）：
* **LCP (Largest Contentful Paint)**：最大内容渲染时间，应该控制在 1.2s 以内。
* **FID (First Input Delay)**：首次输入延迟，应该在 100ms 以内。
* **CLS (Cumulative Layout Shift)**：累积布局偏移，应小于 0.05。

## 2. 代码分割与优化
使用 React 的 \`lazy\` 和 \`Suspense\` 来懒加载页面：
\`\`\`typescript
import React, { lazy, Suspense } from 'react';
const AdminDashboard = lazy(() => import('./components/admin/Dashboard'));
\`\`\`
这样可以让包体积大幅度减小，极大加快首屏加载速度。
`,
    date: "2026-05-15",
    category: "前端开发",
    tags: ["React", "Vite", "性能优化", "Tailwind"],
    readTime: "6分钟阅读",
    views: 890,
    comments: 12,
    gradient: "from-sky-500/30 via-teal-500/10 to-indigo-500/30",
    thumbnailType: "aurora",
    status: "published",
  },
  {
    id: "tech-stack-2024",
    title: "我的 2024 技术栈与工具",
    summary: "身为不妥协的美学追求者，我的日常开发工具链是怎样的？本文全景分享我在 2024 年精选的编码、设计及个人知识管理套件，包含如何通过脚本全自动化发布多渠道文章的工作流...",
    content: `# 我的 2024 技术栈与工具

身为不妥协的美学追求者，我的日常开发工具链是怎样的？本文全景分享我在 2024 年精选的编码、设计及个人知识管理套件，包含如何通过脚本全自动化发布多渠道文章的工作流。

## 1. 核心开发套件
* **IDE**: VS Code + GitHub Copilot + JetBrains Mono 字体
* **Shell**: Oh-My-Zsh + Starship 终端提示符
* **API Testing**: Bruno (取代臃肿的 Postman)

## 2. 知识库与内容发布
通过 Markdown 与 Git 进行版本管理，使用微型 Node.js 脚本一键发布到本地、云端以及多个社交媒体的技术矩阵。
`,
    date: "2026-05-01",
    category: "工具推荐",
    tags: ["工具", "配置", "Workflow", "Mac"],
    readTime: "5分钟阅读",
    views: 650,
    comments: 8,
    gradient: "from-amber-500/20 via-orange-500/10 to-rose-500/30",
    thumbnailType: "mesh",
    status: "published",
  },
  {
    id: "design-patterns",
    title: "设计模式在前端中的应用",
    summary: "如何将经典的 23 种设计模式优雅、不显冗余地融入 React/TypeScript 状态引擎中？本文拆解单例模式、装饰器模式与命令模式，探讨如何构建高度可测试、低耦合的模块化组件...",
    content: `# 设计模式在前端中的应用

如何将经典的 23 种设计模式优雅、不显冗余地融入 React/TypeScript 状态引擎中？本文拆解单例模式、装饰器模式与命令模式。

## 1. 单例模式 (Singleton Pattern)
在一些状态管理库中，我们往往只需要一个唯一的 Store 实例：
\`\`\`typescript
class GlobalStore {
  private static instance: GlobalStore;
  private state = {};
  
  private constructor() {}
  
  public static getInstance() {
    if (!this.instance) {
      this.instance = new GlobalStore();
    }
    return this.instance;
  }
}
\`\`\`

## 2. 观察者模式 (Observer Pattern)
React 的数据流就是经典的观察者模式体现。自定义 Hooks 可以优雅地包装全局观察者订阅。
`,
    date: "2026-04-20",
    category: "设计美学",
    tags: ["设计模式", "TypeScript", "架构", "React"],
    readTime: "10分钟阅读",
    views: 940,
    comments: 24,
    gradient: "from-purple-600/30 via-fuchsia-500/10 to-pink-500/30",
    thumbnailType: "vortex",
    status: "published",
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "personal-blog",
    title: "Personal Blog",
    subtitle: "基于 Next.js + Cloudflare 全栈部署的个人博客系统",
    desc: "一个高度关注视觉审美与极限加载速度的个人全栈空间。在边缘侧通过 Cloudflare KV 做数据缓存优化，D1 存储轻量文章评论，利用 Tailwind CSS v4 打造像素级的优雅暗黑特效。",
    category: "个人项目",
    tags: ["Next.js", "TypeScript", "Cloudflare", "Tailwind CSS"],
    githubUrl: "https://github.com/nono/personal-blog",
    liveUrl: "https://nono.dev",
    date: "2024-05",
    glowColor: "group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(129,140,248,0.15)]",
  },
  {
    id: "note-hub",
    title: "NoteHub",
    subtitle: "一个现代化的笔记与知识管理应用",
    desc: "采用双向联结图谱，支持实时多人协作。内置 Markdown 渲染、AI 概要总结及高级离线数据同步功能。基于 Client-First 架构优化，让灵感记录不再拖泥带水。",
    category: "个人项目",
    tags: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    githubUrl: "https://github.com/nono/note-hub",
    liveUrl: "https://notehub.nono.dev",
    date: "2024-03",
    glowColor: "group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]",
  },
  {
    id: "astro-theme-cosmo",
    title: "Astro Theme Cosmo",
    subtitle: "专为极客设计的沉浸式太空主题模板",
    desc: "面向内容创作者与开发者的 Astro 静态博客模板。内置卓越的 SEO 方案、即开即用的评论模块，并对移动端进行了严苛的滑屏体验测试。拥有 1.5k GitHub Stars 社区赞誉。",
    category: "开源贡献",
    tags: ["Astro", "Tailwind CSS", "Markdown", "SEO"],
    githubUrl: "https://github.com/nono/astro-theme-cosmo",
    liveUrl: "https://cosmo.nono.dev",
    date: "2024-01",
    glowColor: "group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  }
];

export const INITIAL_TAGS: Tag[] = [
  { id: "1", name: "Cloudflare", slug: "cloudflare", color: "from-blue-500 to-indigo-500", count: 4 },
  { id: "2", name: "部署", slug: "deploy", color: "from-emerald-500 to-teal-500", count: 3 },
  { id: "3", name: "Next.js", slug: "nextjs", color: "from-slate-500 to-slate-800", count: 2 },
  { id: "4", name: "TypeScript", slug: "typescript", color: "from-blue-600 to-sky-500", count: 5 },
  { id: "5", name: "React", slug: "react", color: "from-sky-400 to-blue-500", count: 6 },
  { id: "6", name: "Vite", slug: "vite", color: "from-purple-500 to-indigo-600", count: 2 },
  { id: "7", name: "性能优化", slug: "performance", color: "from-amber-500 to-orange-500", count: 2 },
  { id: "8", name: "设计模式", slug: "patterns", color: "from-pink-500 to-rose-500", count: 1 }
];

export const INITIAL_SETTINGS: SiteSettings = {
  nickname: "Nono",
  title: "全栈开发者 & 独立设计师",
  avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=nono",
  bio: "一个热爱技术与设计的开发者，记录思考，分享经验，持续成长。致力于追求极致的性能和像素级的视觉还原。",
  siteTitle: "Space Minimalist Blog",
  siteSlogan: "探索 · 记录 · 分享",
  siteDescription: "一个追求视觉审美、流畅动效 and 极限加载性能的个人全栈星空空间，沉淀设计、技术、以及提效工作流。",
  github: "https://github.com/nono",
  twitter: "https://twitter.com/nono_dev",
  mail: "nono@example.com",
  homeImage: "",
  categoriesTitle: "分类",
  categoriesSubtitle: "分类探寻我感兴趣的研究与工程实践领域",
  categoriesTitleEn: "Categories",
  categoriesSubtitleEn: "Explore my areas of research and engineering practice",
  tagsTitle: "标签",
  tagsSubtitle: "按标签检索与筛选本站内容",
  tagsTitleEn: "Tags",
  tagsSubtitleEn: "Filter content by tags",
  heroTitle: "领域",
  heroSubtitle: "记录与开发相关的核心技能与技术领域",
  heroTitleEn: "Domains",
  heroSubtitleEn: "Documenting core skills and technical domains",
  articlesTitle: "文章",
  articlesSubtitle: "记录学习与思考的点滴",
  articlesTitleEn: "Articles",
  articlesSubtitleEn: "Recording learning and reflections",
  // 关于页 - 统计卡片
  aboutStatsValue1: "8+",
  aboutStatsLabel1: "原创文章",
  aboutStatsLabel1En: "Original Articles",
  aboutStatsValue2: "16",
  aboutStatsLabel2: "技术标签",
  aboutStatsLabel2En: "Tech Tags",
  aboutStatsValue3: "✓",
  aboutStatsLabel3: "持续更新中",
  aboutStatsLabel3En: "Actively Updating",
  // 关于页 - 技术栈与写作方向
  aboutFocusTitle: "技术栈与写作方向",
  aboutFocusTitleEn: "Tech Stack & Writing Focus",
  aboutFocus1Title: "前端工程与性能优化",
  aboutFocus1TitleEn: "Frontend Engineering & Performance",
  aboutFocus1Desc: "React / Next.js / TypeScript 全栈实践，追求极致的首屏渲染速度与流畅交互体验。",
  aboutFocus1DescEn: "React / Next.js / TypeScript full-stack practice, pursuing ultimate first-paint speed and smooth interactions.",
  aboutFocus2Title: "Cloudflare 全栈部署",
  aboutFocus2TitleEn: "Cloudflare Full-Stack Deployment",
  aboutFocus2Desc: "Workers + D1 + R2 架构，Serverless 优先，零运维、全球边缘加速。",
  aboutFocus2DescEn: "Workers + D1 + R2 architecture, Serverless-first, zero-ops global edge acceleration.",
  aboutFocus3Title: "设计美学与交互细节",
  aboutFocus3TitleEn: "Design Aesthetics & Micro-interactions",
  aboutFocus3Desc: "太空极简风、像素级还原、微动效缓动曲线，相信好的产品源自对细节的偏执。",
  aboutFocus3DescEn: "Space-minimalist style, pixel-perfect implementation, subtle easing curves — great products come from obsessive detail.",
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "frontend",
    title: "前端开发",
    desc: "探索 HTML5/CSS3、TypeScript、React/Next.js 等前沿网页客户端技术与工程化体系。",
    colorName: "前端开发",
    iconType: "laptop"
  },
  {
    id: "backend",
    title: "后端开发",
    desc: "精进微服务、高可用架构设计，深耕 Node.js、Go、Redis 及数据库存取模式。",
    colorName: "后端开发",
    iconType: "server"
  },
  {
    id: "cloud",
    title: "运维部署",
    desc: "分享 Cloudflare 生态、Docker 容器化管理与 CI/CD 极速部署的最佳实践。",
    colorName: "Cloudflare",
    iconType: "cloud"
  },
  {
    id: "design",
    title: "设计美学",
    desc: "像素级前端还原技术，前沿大厂视觉、排版美感设计与优雅微交互细节探索。",
    colorName: "设计美学",
    iconType: "palette"
  },
  {
    id: "life",
    title: "生活随笔",
    desc: "代码之外的纯粹表达。关于读书、徒步、技术博主的日常思绪碎碎念。",
    colorName: "全部",
    iconType: "pen-tool"
  },
  {
    id: "tools",
    title: "工具推荐",
    desc: "高生产力效率工具、高级命令行配置、自动化工作流等不妥协美学套件。",
    colorName: "工具推荐",
    iconType: "wrench"
  }
];

