# Nono Blog - 太空极简风全栈博客

基于 Cloudflare 全栈架构的零成本个人博客系统。

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/TypeScript-5-blue) ![Tech Stack](https://img.shields.io/badge/Vite-6-purple) ![Tech Stack](https://img.shields.io/badge/Cloudflare-Pages-orange) ![License](https://img.shields.io/badge/License-MIT-green)

## 特性

- **零成本部署**：Cloudflare Pages + Workers + D1 + R2 全免费额度
- **全球加速**：300+ 边缘节点，毫秒级响应
- **双主题设计**：太空暗色 / 暖色护眼亮色
- **中英双语**：完整国际化，严格互斥
- **Markdown 渲染**：支持代码高亮、表格、代码块一键复制
- **Giscus 评论**：GitHub Discussions 登录评论，零后端维护
- **点赞持久化**：D1 存储 + IP 哈希去重（24小时冷却）
- **后台管理**：独立 Admin 面板，文章 CRUD + 评论审核
- **自动部署**：GitHub Actions CI/CD，推送即上线

## 技术架构

```
前端（React + Vite + Tailwind CSS）
  ↓ Cloudflare Pages 部署
  ↓
后端 API（Cloudflare Workers）
  ↓
数据库（D1 SQLite）  +  图片存储（R2）
```

| 组件 | 技术 | 免费额度 |
|------|------|---------|
| 前端部署 | Cloudflare Pages | 无限构建 + 100GB/月流量 |
| API 服务 | Cloudflare Workers | 10万次请求/天 |
| 数据库 | Cloudflare D1 | 500万行读取/天，5GB存储 |
| 图片存储 | Cloudflare R2 | 10GB存储，1000万次读取/月 |
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
```

### 3. 配置环境变量

复制示例文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# Workers API 地址（部署后替换）
VITE_API_URL=https://your-api.workers.dev
```

### 4. 本地开发

```bash
npm run dev
```

访问 http://localhost:5173

### 5. 构建

```bash
npm run build
```

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
- 首次使用 R2 需先开通服务

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

复制配置模板：

```bash
cp wrangler.toml.example wrangler.toml
```

编辑 `workers/wrangler.toml`：

```toml
name = "blog-api"
main = "src/index.ts"
compatibility_date = "2024-05-20"

[[d1_databases]]
binding = "DB"
database_name = "blog_db"
database_id = "替换为你的D1数据库ID"

[[r2_buckets]]
binding = "IMAGES"
bucket_name = "blog-images"

[vars]
JWT_SECRET = "生成一个随机字符串"
```

生成随机 JWT_SECRET：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

部署：

```bash
npx wrangler deploy
```

记下返回的 Workers URL（如 `https://blog-api.xxx.workers.dev`）。

### 步骤 3：初始化数据库

```bash
# 创建表结构
npx wrangler d1 execute blog_db --remote --file=migrations/0001_init.sql

# 导入种子数据
npx wrangler d1 execute blog_db --remote --file=migrations/0002_seed.sql

# 更新文章内容
npx wrangler d1 execute blog_db --remote --file=migrations/0003_update_content.sql
```

### 步骤 4：部署前端

```bash
cd ..
```

构建前端：

```bash
npm run build
```

部署到 Cloudflare Pages：

```bash
npx wrangler pages deploy dist --project-name=nono-blog
```

### 步骤 5：配置自定义域名（可选）

1. Cloudflare Dashboard → Pages → 你的项目 → **Custom domains**
2. 添加域名（如 `blog.example.com`）
3. Cloudflare 会自动配置 DNS 和 SSL

同样为 Workers 配置自定义域名：
1. Workers → 你的 Worker → **Settings** → **Domains & Routes**
2. 添加域名（如 `api.example.com`）

### 步骤 6：配置 Giscus 评论

1. 确保仓库为 **公开**
2. 仓库 **Settings** → **Features** → 勾选 **Discussions**
3. 安装 [Giscus App](https://github.com/apps/giscus) 到仓库
4. 访问 https://giscus.app/zh-CN 配置并获取嵌入代码
5. 将代码中的参数更新到 `src/components/Giscus.tsx`

### 步骤 7：配置自动部署

1. 仓库 **Settings** → **Secrets and variables** → **Actions**
2. 添加 Secret：
   - `CLOUDFLARE_API_TOKEN`：步骤 1.3 创建的 Token
   - `CLOUDFLARE_ACCOUNT_ID`：Dashboard 首页右侧的 Account ID
3. 推送到 `main` 分支即自动触发部署

## 项目结构

```
Nono-Blog/
├── src/                      # 前端源码
│   ├── components/           # React 组件
│   │   ├── admin/            # Admin 后台组件
│   │   ├── ArticleDetail.tsx # 文章详情 + Markdown 渲染
│   │   ├── Giscus.tsx        # Giscus 评论集成
│   │   └── MarkdownRenderer.tsx # Markdown 渲染器
│   ├── data/                 # 类型定义 + 翻译
│   ├── App.tsx               # 主应用
│   └── AdminApp.tsx          # Admin 应用
├── workers/                  # Workers API 后端
│   ├── src/index.ts          # API 路由
│   └── migrations/           # 数据库迁移
├── public/                   # 静态资源
└── .github/workflows/        # CI/CD 配置
```

## 默认管理员账号

首次部署后，后台默认账号：

- 用户名：`admin`
- 密码：`admin`

**生产环境请立即修改！** 在 D1 数据库中更新：

```sql
UPDATE admin_users SET password_hash = '你的新密码' WHERE username = 'admin';
```

## 数据存储

所有数据存储在 Cloudflare 基础设施中，可通过 Dashboard 或 wrangler CLI 查看和管理：

| 数据 | 存储位置 | 查看方式 |
|------|---------|--------|
| 文章、标签、分类、评论、点赞 | D1 数据库 (`blog_db`) | `npx wrangler d1 execute blog_db --remote --command="SELECT * FROM articles;"` |
| 站点配置（昵称/头像/背景图等） | D1 `site_settings` 表 | `npx wrangler d1 execute blog_db --remote --command="SELECT * FROM site_settings;"` |
| 上传的图片 | R2 存储桶 (`blog-images`) | Dashboard → R2 → `blog-images` |

也可以在 [Cloudflare Dashboard](https://dash.cloudflare.com) 中可视化查看：
- **D1**：Workers & Pages → D1 → `blog_db` → Console
- **R2**：左侧菜单 → R2 → `blog-images`

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

## License

[MIT](LICENSE)
