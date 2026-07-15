# Nono Blog - 太空极简风全栈博客

基于 Cloudflare 全栈架构的零成本个人博客系统。前端 React 19 + Vite 6 + Tailwind CSS 4，后端 Workers + D1 + R2，全球边缘节点毫秒级响应。

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-cyan) ![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages%20%7C%20Workers-orange) ![License](https://img.shields.io/badge/License-MIT-green)

## 特性

- **零成本部署**：Cloudflare Pages + Workers + D1 + R2 全免费额度覆盖
- **全球加速**：300+ 边缘节点，毫秒级响应
- **深色模式**：太空星空主题，动态粒子背景 + SVG 山脉插画
- **中英双语**：完整国际化，中英文严格互斥切换
- **Markdown 渲染**：react-markdown + rehype-highlight 代码高亮 + GFM 支持
- **Giscus 评论**：GitHub Discussions 登录评论，零后端维护
- **点赞系统**：D1 存储 + IP 哈希去重（24 小时冷却）
- **浏览统计**：daily_views 每日阅读统计 + Dashboard 流量走势图表
- **后台管理**：独立 Admin 面板（`/admin.html`），文章 CRUD、评论审核、标签/分类管理
- **站点配置**：头像、昵称、标语、背景图、页面标题等全部后台可配
- **图片上传**：R2 对象存储，支持头像、背景图、文章封面上传
- **分页搜索**：文章列表分页 + 页码跳转 + 分类筛选 + 关键字搜索
- **Loading 体系**：统一 LoadingOverlay 组件覆盖所有 CRUD 和文件上传操作
- **双入口构建**：Vite 多入口打包，主站 `index.html` + 后台 `admin.html`

## 技术架构

```
前端（React 19 + Vite 6 + Tailwind CSS 4 + motion）
  ↓ Cloudflare Pages 部署（双入口：主站 + 后台）
  ↓
后端 API（Cloudflare Workers）
  ↓
D1 SQLite（文章/标签/分类/评论/点赞/配置/浏览统计）  +  R2（图片存储）
```

| 组件 | 技术 | 免费额度 |
|------|------|---------|
| 前端部署 | Cloudflare Pages | 无限构建 + 100GB/月流量 |
| API 服务 | Cloudflare Workers | 10 万次请求/天 |
| 数据库 | Cloudflare D1 | 500 万行读取/天，5GB 存储 |
| 图片存储 | Cloudflare R2 | 10GB 存储，1000 万次读取/月 |
| 评论系统 | Giscus | 完全免费 |

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare 账号](https://dash.cloudflare.com/sign-up)
- [GitHub 账号](https://github.com/signup)

### 1. 克隆仓库

```bash
git clone https://github.com/luyaoba/Nono-Blog.git
cd Nono-Blog
```

### 2. 安装依赖

```bash
npm install
cd workers && npm install && cd ..
```

### 3. 配置环境变量

复制示例文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# 管理员登录凭证（默认 admin/admin，生产环境请修改）
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=admin

# Workers API 地址（部署后替换为你自己的 Worker 域名或自定义域名）
VITE_API_URL=https://your-worker.workers.dev
```

### 4. 本地开发

```bash
npm run dev
```

- 主站：http://localhost:3000
- 后台：http://localhost:3000/admin.html

### 5. 构建

```bash
npm run build
```

产物输出到 `dist/`，包含 `index.html` 和 `admin.html` 两个入口。

## Cloudflare 部署指南

### 步骤 1：创建 Cloudflare 资源

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单 → **Workers & Pages** → 点击 **Create**

#### 1.1 创建 D1 数据库

- Workers & Pages → D1 → **Create database**
- 名称填 `blog_db`，点击 Create
- 记下 **Database ID**

#### 1.2 创建 R2 存储桶

- 左侧菜单 → **R2** → **Create bucket**
- 名称填 `blog-images`，点击 Create
- 首次使用 R2 需先在 Dashboard 开通 R2 服务

#### 1.3 创建 API Token

- 右上角头像 → **My Profile** → **API Tokens** → **Create Token**
- 选择 **Custom token**，配置以下权限：

| 资源 | 权限 |
|------|------|
| Account - Cloudflare Pages | Edit |
| Account - Cloudflare Workers Scripts | Edit |
| Account - Cloudflare D1 | Edit |
| Account - Cloudflare R2 Storage | Edit |
| Account - Cloudflare Workers Tail | Read |
| User - Memberships | Read |

### 步骤 2：部署 Workers API

```bash
cd workers
```

编辑 `workers/wrangler.toml.example`，替换 `database_id`，然后复制为 `workers/wrangler.toml`：

```toml
name = "blog-api"
main = "src/index.ts"
compatibility_date = "2024-09-01"

[[d1_databases]]
binding = "DB"
database_name = "blog_db"
database_id = "替换为你的 D1 数据库 ID"

[[r2_buckets]]
binding = "IMAGES"
bucket_name = "blog-images"
```

**注意：JWT_SECRET 不要写在 `wrangler.toml` 的 `[vars]` 中，否则可能泄露到 Git。**

生成随机 JWT_SECRET 并通过 wrangler secret 设置：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
cd workers
npx wrangler secret put JWT_SECRET
```

部署：

```bash
npx wrangler deploy
```

记下返回的 Workers URL（如 `https://blog-api.xxx.workers.dev`）。

### 步骤 3：初始化数据库

```bash
# 创建表结构（articles, tags, categories, comments, site_settings 等 9 张表）
npx wrangler d1 execute blog_db --remote --file=migrations/0001_init.sql

# 导入种子数据（示例文章、标签、分类、评论、站点配置）
npx wrangler d1 execute blog_db --remote --file=migrations/0002_seed.sql

# 创建补充表（daily_views 浏览统计 + article_likes_ip 点赞去重）
npx wrangler d1 execute blog_db --remote --command="
CREATE TABLE IF NOT EXISTS daily_views (
  article_id TEXT NOT NULL,
  date TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  PRIMARY KEY (article_id, date)
);
CREATE TABLE IF NOT EXISTS article_likes_ip (
  article_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (article_id, ip_hash)
);
ALTER TABLE articles ADD COLUMN likes INTEGER DEFAULT 0;
"

# 更新文章内容（可选）
npx wrangler d1 execute blog_db --remote --file=migrations/0003_update_content.sql
```

### 步骤 4：部署前端

```bash
cd ..
npm run build
npx wrangler pages deploy dist --project-name=nono-blog
```

### 步骤 5：配置自定义域名（可选）

1. Cloudflare Dashboard → Pages → 你的项目 → **Custom domains**
2. 添加域名（如 `blog.example.com`）
3. Cloudflare 会自动配置 DNS 和 SSL

同样为 Workers 配置自定义域名：
1. Workers → 你的 Worker → **Settings** → **Domains & Routes**
2. 添加域名（如 `api.example.com`）
3. 更新 `.env.local` 中的 `VITE_API_URL` 为你的 Workers 自定义域名

### 步骤 6：配置 Giscus 评论

1. 确保 GitHub 仓库为 **公开**
2. 仓库 **Settings** → **Features** → 勾选 **Discussions**
3. 安装 [Giscus App](https://github.com/apps/giscus) 到仓库
4. 访问 https://giscus.app/zh-CN 配置并获取嵌入参数
5. 将参数更新到 `src/components/Giscus.tsx`

### 步骤 7：配置自动部署（可选）

1. 仓库 **Settings** → **Secrets and variables** → **Actions**
2. 添加 Secret：
   - `CLOUDFLARE_API_TOKEN`：步骤 1.3 创建的 Token
   - `CLOUDFLARE_ACCOUNT_ID`：Dashboard 首页右侧的 Account ID
3. 推送到 `main` 分支即自动触发部署

## 项目结构

```
Nono-Blog/
├── src/                          # 前端源码
│   ├── components/               # React 组件
│   │   ├── admin/                # 后台管理组件
│   │   │   ├── AdminDashboard.tsx   # 仪表盘 + 流量走势图表
│   │   │   ├── AdminPosts.tsx       # 文章管理（CRUD + 分页 + 封面上传）
│   │   │   ├── AdminTags.tsx        # 标签 & 分类管理
│   │   │   ├── AdminSettings.tsx    # 站点配置（头像/标语/页面标题等）
│   │   │   ├── AdminComments.tsx    # 评论审核
│   │   │   ├── AdminLayout.tsx      # 后台布局（侧边栏 + 语言切换）
│   │   │   ├── AdminLogin.tsx       # 登录页
│   │   │   ├── LoadingOverlay.tsx   # 统一 Loading 遮罩组件
│   │   │   └── ConfirmDialog.tsx    # 统一确认对话框
│   │   ├── Hero.tsx              # 首页主视觉 + 领域卡片
│   │   ├── Articles.tsx          # 文章列表 + 分类筛选 + 搜索
│   │   ├── ArticleDetail.tsx     # 文章详情 + Markdown 渲染 + 浏览量统计
│   │   ├── Categories.tsx        # 分类页（后台可配标题）
│   │   ├── Tags.tsx              # 标签页（后台可配标题）
│   │   ├── About.tsx             # 关于页
│   │   ├── Navbar.tsx            # 导航栏
│   │   ├── Search.tsx            # 全局搜索
│   │   ├── Giscus.tsx            # Giscus 评论集成
│   │   └── MarkdownRenderer.tsx  # Markdown 渲染器
│   ├── data/                     # 类型定义 + 初始数据 + 翻译
│   │   ├── mockAdminData.ts      # 接口定义 + 初始种子数据
│   │   └── translations.ts       # 中英文翻译
│   ├── api.ts                    # API 客户端（公开 + 管理员接口）
│   ├── App.tsx                   # 主应用入口
│   ├── AdminApp.tsx              # 后台应用入口
│   ├── main.tsx                  # 主站挂载点
│   ├── admin.tsx                 # 后台挂载点
│   └── index.css                 # 全局样式（Tailwind CSS 4）
├── workers/                      # Workers API 后端
│   ├── src/index.ts              # API 路由（文章/标签/分类/评论/配置/上传/统计）
│   ├── migrations/               # 数据库迁移脚本
│   │   ├── 0001_init.sql         # 建表（9 张表）
│   │   ├── 0002_seed.sql         # 种子数据
│   │   └── 0003_update_content.sql
│   └── wrangler.toml             # Workers 配置
├── index.html                    # 主站入口
├── admin.html                    # 后台入口（noindex 防爬）
├── vite.config.ts                # Vite 构建配置（双入口）
├── package.json
└── tsconfig.json
```

## 数据库表结构

| 表名 | 用途 |
|------|------|
| `articles` | 文章（标题/摘要/内容/分类/标签/状态/封面/浏览量/点赞数） |
| `tags` | 标签 |
| `categories` | 分类（标题/描述/图标类型） |
| `comments` | 评论（待审/已审/垃圾） |
| `site_settings` | 站点配置（键值对，昵称/头像/标语/页面标题等） |
| `projects` | 项目展示 |
| `article_tags` | 文章-标签多对多关联 |
| `project_tags` | 项目-标签关联 |
| `admin_users` | 管理员账号（用户名 + 密码哈希） |
| `daily_views` | 每日浏览统计（按文章 + 日期聚合） |
| `article_likes_ip` | 点赞 IP 去重记录 |

## 默认管理员账号

首次部署后，后台默认账号：

- 用户名：`admin`
- 密码：`admin`

**生产环境请立即修改！** 在 D1 数据库中更新：

```sql
UPDATE admin_users SET password_hash = '你的新密码哈希' WHERE username = 'admin';
```

后台访问地址：`https://你的域名/admin.html`

## API 概览

### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/articles` | 获取已发布文章列表 |
| GET | `/api/articles/:id` | 获取单篇文章（自动 +1 浏览量） |
| GET | `/api/articles/:id/likes` | 获取点赞数 + 当前 IP 是否已赞 |
| POST | `/api/articles/:id/likes` | 点赞（IP 去重，24h 冷却） |
| GET | `/api/projects` | 获取项目列表 |
| GET | `/api/tags` | 获取标签列表（仅统计已发布文章） |
| GET | `/api/categories` | 获取分类列表 |
| GET | `/api/comments?articleId=` | 获取已审核评论 |
| POST | `/api/comments` | 提交评论 |
| GET | `/api/settings` | 获取站点配置 |
| POST | `/api/auth/login` | 管理员登录（返回 JWT） |

### 管理员接口（需 JWT Bearer Token）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/articles` | 创建文章 |
| PUT | `/api/admin/articles/:id` | 更新文章（支持部分更新） |
| DELETE | `/api/admin/articles/:id` | 删除文章 |
| GET | `/api/admin/comments` | 获取全部评论 |
| PUT | `/api/admin/comments/:id` | 审核评论 |
| DELETE | `/api/admin/comments/:id` | 删除评论 |
| PUT | `/api/admin/settings` | 更新站点配置 |
| POST | `/api/admin/upload` | 上传图片到 R2（≤5MB） |
| GET | `/api/admin/daily-views` | 浏览统计（支持 week/month/year/all/custom 范围） |

## 常见问题

### Q: Workers 部署报权限错误？
A: 检查 API Token 是否包含 Workers Scripts Edit 权限，以及 User Memberships Read 权限。

### Q: R2 命令报错？
A: 首次使用 R2 需要在 Dashboard 左侧菜单 → R2 → 点击开通。

### Q: D1 执行 SQL 超时？
A: D1 大文件导入可能需要几秒，耐心等待即可。如果持续失败，尝试分拆 SQL 文件。

### Q: Giscus 评论区不显示？
A: 确认三个条件：仓库公开、Giscus App 已安装、Discussions 已开启。

### Q: 点赞后刷新不变红？
A: 检查浏览器是否阻止了第三方 Cookie，或尝试使用无痕模式测试。

### Q: 后台修改配置后前端没生效？
A: 刷新前端页面即可。后台保存后会重新从 API 拉取最新配置并同步到前端。

### Q: `JWT_SECRET` 应该怎么设置？

A: 不要写在 `wrangler.toml` 的 `[vars]` 中（该文件可能意外提交到 Git）。正确做法：

```bash
cd workers
npx wrangler secret put JWT_SECRET
```

输入一个随机字符串（推荐 32 字节 hex）。

## License

[MIT](LICENSE)
