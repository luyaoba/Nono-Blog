-- 文章表
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT DEFAULT '',
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT DEFAULT '',
  views INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  gradient TEXT DEFAULT '',
  thumbnail_type TEXT DEFAULT 'starfield',
  status TEXT DEFAULT 'published' CHECK(status IN ('published', 'draft')),
  cover_image TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 项目表
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  category TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  date TEXT DEFAULT '',
  glow_color TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '',
  count INTEGER DEFAULT 0
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  color_name TEXT DEFAULT '',
  icon_type TEXT DEFAULT 'laptop'
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  email TEXT DEFAULT '',
  article_id TEXT NOT NULL,
  article_title TEXT DEFAULT '',
  content TEXT NOT NULL,
  images TEXT DEFAULT '[]',
  date TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'spam')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- 站点配置表
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 文章-标签关联表
CREATE TABLE IF NOT EXISTS article_tags (
  article_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- 项目-标签关联表
CREATE TABLE IF NOT EXISTS project_tags (
  project_id TEXT NOT NULL,
  tag_name TEXT NOT NULL,
  PRIMARY KEY (project_id, tag_name)
);

-- 管理员表
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
