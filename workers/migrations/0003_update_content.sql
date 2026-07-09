-- 更新文章 Markdown 内容

UPDATE articles SET content = '## 1. 为什么选择 Cloudflare?

在传统的 Web 架构中，全栈应用往往需要依赖专用的虚拟机、后端服务器集群以及高昂的网络专线。这不仅大幅提升了前期的运维门槛，也让中小型独立开发者在面临流量洪峰时需要时刻担心服务器瓶颈。

而 **Cloudflare** 提供了一整套云原生、全无服务器（Serverless）的现代基础设施。它利用遍布全球的 300 多个骨干节点（Edge Network），真正实现了"代码和数据在全球边缘同时运行"。相比传统的托管环境，它具备近乎零的冷启动时间，极度轻量的打包体积，以及业内首个全免费额度。

## 2. 极速 Cloudflare Pages 部署

Cloudflare Pages 是专门为前端 SPA 以及主流 SSR 框架量身打造的静态/全栈托管平台。如果你使用的是 Vite 或 Next.js，仅需两步即可自动构建并发布：

- 绑定你的 GitHub 仓库
- 在配置中选择框架并指定输出路径为 `dist`
- 享受由全球 CDN 节点支撑的 50ms 以内的首包触达体验

## 3. Serverless Workers 路由与配置

当静态页面需要连接动态 API 时，Cloudflare Workers 是绝佳的解决方案。其本质是在 V8 隔离沙箱中运行的极轻量 JavaScript 运行时。

通过配置一个简单的 `wrangler.toml` 配置文件，你可以轻松将关系型数据库 D1 以及 R2 存储桶注入到代码运行时中：

```toml
name = "blog-api"
main = "src/index.ts"
compatibility_date = "2024-05-20"

[[d1_databases]]
binding = "DB"
database_name = "blog_db"

[[r2_buckets]]
binding = "IMAGES"
bucket_name = "blog-images"
```

## 4. D1 关系型数据库整合

D1 是 Cloudflare 原生的、基于 SQLite 的嵌入式关系型数据库，具有极低的网络访问延迟。通过 D1，你可以像编写常规 SQL 语句一样对文章数据、留言信息进行实时检索。

| 功能 | 免费额度 |
|------|---------|
| 读取行数 | 500万行/天 |
| 写入行数 | 10万行/天 |
| 存储 | 5GB |

## 5. 自定义域名与 SSL 锁

部署完成后，通过仪表盘只需轻轻点击一下即可完成自定义域名解析，Cloudflare 会自动为您签发高安全性的 Universal SSL 证书，并自动重定向所有非安全 HTTP 流量。

## 6. 结语与成本复盘

在本篇实践中，我们将全栈应用的月度支出压缩到了惊人的 **$0 元**。Pages 无限制构建次数、Workers 每日 10 万次免费调用额度、D1 日均 500 万行读取，完美承载一个每日万级 PV 的个人太空美学博客系统。'
WHERE id = 'cloudflare-deploy';

UPDATE articles SET content = '## 为什么选择自建博客？

在 Medium、知乎等平台泛滥的今天，拥有一个属于自己的独立博客显得格外珍贵。它不受平台审核限制，不被算法推荐绑架，完全由你掌控内容和样式。

## 技术选型

本博客采用以下技术栈：

- **前端**：React + Vite + TypeScript + Tailwind CSS
- **后端**：Cloudflare Workers（无服务器函数）
- **数据库**：Cloudflare D1（SQLite）
- **存储**：Cloudflare R2（兼容 S3 的对象存储）
- **部署**：Cloudflare Pages + GitHub Actions 自动部署
- **评论**：Giscus（基于 GitHub Discussions）

## 核心特性

1. **零成本**：所有服务均在免费额度内
2. **全球加速**：300+ 边缘节点，毫秒级响应
3. **暗色/亮色双主题**：太空极简风设计
4. **中英双语**：完整国际化支持
5. **评论系统**：GitHub 登录 + 审核制
6. **后台管理**：独立 Admin 面板，支持文章 CRUD

## 性能表现

> Lighthouse 得分 95+，首屏加载 < 1s，完全达到现代 Web 标准。'
WHERE id = 'high-perf-blog';

UPDATE articles SET content = '## 前端开发

- **框架**：React 18 + TypeScript
- **构建**：Vite 6
- **样式**：Tailwind CSS 4
- **动画**：Framer Motion
- **图标**：Lucide React

## 后端与基础设施

- **计算**：Cloudflare Workers
- **数据库**：Cloudflare D1（SQLite）
- **对象存储**：Cloudflare R2
- **部署**：Cloudflare Pages

## 开发工具

| 工具 | 用途 |
|------|------|
| VS Code | 主力编辑器 |
| GitHub Desktop | Git 管理 |
| Wrangler CLI | Cloudflare 部署 |
| npm | 包管理 |

## 设计灵感

- 太空极简风（Space Minimalism）
- 深色为主、亮色为辅的双主题设计
- 参考了 Linear、Vercel 等产品的 UI 风格

## 学习资源

> 持续学习是开发者最重要的投资。推荐关注 Cloudflare Blog、web.dev 和 React 官方文档。'
WHERE id = 'tech-stack-2024';

UPDATE articles SET content = '## 创建型模式

### 单例模式（Singleton）

确保一个类只有一个实例，并提供全局访问点。在前端中常见于全局状态管理、主题管理等场景。

```typescript
class ThemeManager {
  private static instance: ThemeManager;
  private theme: "dark" | "light" = "dark";

  static getInstance() {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  toggle() {
    this.theme = this.theme === "dark" ? "light" : "dark";
  }
}
```

### 工厂模式（Factory）

根据条件创建不同类型的对象。适用于组件动态渲染场景。

## 结构型模式

### 适配器模式（Adapter）

将一个类的接口转换成客户端期望的接口。在对接第三方 API 时非常实用。

### 装饰器模式（Decorator）

动态地给对象添加额外功能。React 中的 HOC（Higher-Order Component）就是这个模式的体现。

## 行为型模式

- **观察者模式**：事件系统的基础，如 `addEventListener`
- **策略模式**：表单验证中不同规则的切换
- **命令模式**：撤销/重做操作的实现

> 设计模式不是银弹，过度使用反而会增加代码复杂度。在合适的场景使用合适的模式才是关键。'
WHERE id = 'design-patterns';
