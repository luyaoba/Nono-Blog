-- 种子数据：文章
INSERT OR IGNORE INTO articles (id, title, summary, content, date, category, read_time, views, comments_count, gradient, thumbnail_type, status) VALUES
('cloudflare-deploy', '使用 Cloudflare 部署全栈应用', 'Cloudflare 不仅仅是一个 CDN。现在，就让我们利用 Pages、Workers 以及 D1/KV 数据库来搭建并部署一个极速、弹性、完全免费的现代全栈博客应用。', '# 使用 Cloudflare 部署全栈应用\n\nCloudflare 不仅仅是一个 CDN...', '2024-05-20', 'Cloudflare', '8分钟阅读', 1240, 18, 'from-blue-600/30 via-indigo-500/20 to-purple-600/30', 'starfield', 'published'),
('high-perf-blog', '从零构建一个高性能 Blog', '极致的渲染速度与像素级还原是高端美学的底线。本文深入剖析如何使用 Vite 的深度打包策略、资源预加载、骨架屏微动效以及 Tailwind 极简主题机制。', '# 从零构建一个高性能 Blog\n\n极致的渲染速度与像素级还原...', '2024-05-15', '前端开发', '6分钟阅读', 890, 12, 'from-sky-500/30 via-teal-500/10 to-indigo-500/30', 'aurora', 'published'),
('tech-stack-2024', '我的 2024 技术栈与工具', '身为不妥协的美学追求者，我的日常开发工具链是怎样的？本文全景分享我在 2024 年精选的编码、设计及个人知识管理套件。', '# 我的 2024 技术栈与工具\n\n身为不妥协的美学追求者...', '2024-05-01', '工具推荐', '5分钟阅读', 650, 8, 'from-amber-500/20 via-orange-500/10 to-rose-500/30', 'mesh', 'published'),
('design-patterns', '设计模式在前端中的应用', '如何将经典的 23 种设计模式优雅、不显冗余地融入 React/TypeScript 状态引擎中？本文拆解单例模式、装饰器模式与命令模式。', '# 设计模式在前端中的应用\n\n如何将经典的 23 种设计模式...', '2024-04-20', '设计美学', '10分钟阅读', 940, 24, 'from-purple-600/30 via-fuchsia-500/10 to-pink-500/30', 'vortex', 'published');

-- 种子数据：项目
INSERT OR IGNORE INTO projects (id, title, subtitle, description, category, github_url, live_url, date, glow_color) VALUES
('personal-blog', 'Personal Blog', '基于 Next.js + Cloudflare 全栈部署的个人博客系统', '一个高度关注视觉审美与极限加载速度的个人全栈空间。', '个人项目', 'https://github.com/nono/personal-blog', 'https://nono.dev', '2024-05', 'group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(129,140,248,0.15)]'),
('note-hub', 'NoteHub', '一个现代化的笔记与知识管理应用', '采用双向联结图谱，支持实时多人协作。', '个人项目', 'https://github.com/nono/note-hub', 'https://notehub.nono.dev', '2024-03', 'group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]'),
('astro-theme-cosmo', 'Astro Theme Cosmo', '专为极客设计的沉浸式太空主题模板', '面向内容创作者与开发者的 Astro 静态博客模板。', '开源贡献', 'https://github.com/nono/astro-theme-cosmo', 'https://cosmo.nono.dev', '2024-01', 'group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]');

-- 种子数据：标签
INSERT OR IGNORE INTO tags (id, name, slug, color, count) VALUES
('1', 'Cloudflare', 'cloudflare', 'from-blue-500 to-indigo-500', 4),
('2', '部署', 'deploy', 'from-emerald-500 to-teal-500', 3),
('3', 'Next.js', 'nextjs', 'from-slate-500 to-slate-800', 2),
('4', 'TypeScript', 'typescript', 'from-blue-600 to-sky-500', 5),
('5', 'React', 'react', 'from-sky-400 to-blue-500', 6),
('6', 'Vite', 'vite', 'from-purple-500 to-indigo-600', 2),
('7', '性能优化', 'performance', 'from-amber-500 to-orange-500', 2),
('8', '设计模式', 'patterns', 'from-pink-500 to-rose-500', 1);

-- 种子数据：分类
INSERT OR IGNORE INTO categories (id, title, description, color_name, icon_type) VALUES
('frontend', '前端开发', '探索 HTML5/CSS3、TypeScript、React/Next.js 等前沿网页客户端技术与工程化体系。', '前端开发', 'laptop'),
('backend', '后端开发', '精进微服务、高可用架构设计，深耕 Node.js、Go、Redis 及数据库存取模式。', '后端开发', 'server'),
('cloud', '运维部署', '分享 Cloudflare 生态、Docker 容器化管理与 CI/CD 极速部署的最佳实践。', 'Cloudflare', 'cloud'),
('design', '设计美学', '像素级前端还原技术，前沿大厂视觉、排版美感设计与优雅微交互细节探索。', '设计美学', 'palette'),
('life', '生活随笔', '代码之外的纯粹表达。关于读书、徒步、技术博主的日常思绪碎碎念。', '全部', 'pen-tool'),
('tools', '工具推荐', '高生产力效率工具、高级命令行配置、自动化工作流等不妥协美学套件。', '工具推荐', 'wrench');

-- 种子数据：评论
INSERT OR IGNORE INTO comments (id, author, avatar, email, article_id, article_title, content, date, status) VALUES
('c-1', '宇航员小白', 'https://api.dicebear.com/7.x/bottts/svg?seed=white', 'xiaobai@space.com', 'cloudflare-deploy', '使用 Cloudflare 部署全栈应用', '这篇全栈部署指南真的太细致了！跟着一步步操作，我的 Pages 和 D1 数据库直接通了，边缘节点响应简直是零迟滞！', '2026-07-07 18:24', 'approved'),
('c-2', '前端架构师-老刘', 'https://api.dicebear.com/7.x/bottts/svg?seed=laoliu', 'laoliu@architect.com', 'high-perf-blog', '从零构建一个高性能 Blog', '代码分割和 CDN 预热部分写得很棒。不过我想问，如果组件中有很多大体量的第三方图表组件，如何最优雅地进行路由分割呢？', '2026-07-06 14:10', 'pending'),
('c-3', 'SEO运营官', 'https://api.dicebear.com/7.x/bottts/svg?seed=spam', 'advert@spammail.com', 'tech-stack-2024', '我的 2024 技术栈与工具', '超低价承接各类博客流量推广、SEO优化、外链代发，联系微信：xxxxxx', '2026-07-05 09:12', 'spam'),
('c-4', '小林Coding', 'https://api.dicebear.com/7.x/bottts/svg?seed=xiaolin', 'xiaolin@coding.dev', 'design-patterns', '设计模式在前端中的应用', '单例模式在 React 的 Context 包装层确实很经典。期待博主下一篇分享一下发布订阅模式和行为类模式！', '2026-07-04 22:50', 'approved');

-- 种子数据：站点配置
INSERT OR IGNORE INTO site_settings (key, value) VALUES
('nickname', 'Nono'),
('title', '全栈开发者 & 独立设计师'),
('avatarUrl', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=nono'),
('bio', '一个热爱技术与设计的开发者，记录思考，分享经验，持续成长。'),
('siteTitle', 'Space Minimalist Blog'),
('siteSlogan', '探索 · 记录 · 分享'),
('siteDescription', '一个追求视觉审美、流畅动效和极限加载性能的个人全栈星空空间。'),
('github', 'https://github.com/nono'),
('twitter', 'https://twitter.com/nono_dev'),
('mail', 'nono@example.com'),
('homeImage', '');

-- 种子数据：文章-标签关联
INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES
('cloudflare-deploy', '1'), ('cloudflare-deploy', '2'), ('cloudflare-deploy', '3'), ('cloudflare-deploy', '4'),
('high-perf-blog', '5'), ('high-perf-blog', '6'), ('high-perf-blog', '7'),
('tech-stack-2024', '8'),
('design-patterns', '4'), ('design-patterns', '5');
