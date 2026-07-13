// ===== 类型定义 =====
interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  JWT_SECRET: string;
}

// ===== 工具函数 =====
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function error(msg: string, status = 400) {
  return json({ error: msg }, status);
}

// 从 Authorization header 中提取并验证 JWT
async function verifyAuth(request: Request, secret: string): Promise<{ sub: string } | null> {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return null;
  try {
    const token = header.slice(7);
    const [headerB64, payloadB64, sigB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !sigB64) return null;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('HMAC', key, base64UrlDecode(sigB64), new TextEncoder().encode(`${headerB64}.${payloadB64}`));
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// 签发 JWT
async function signJwt(payload: object, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const enc = (obj: object) => base64UrlEncode(new TextEncoder().encode(JSON.stringify(obj)));
  const headerB64 = enc(header);
  const payloadB64 = enc(payload);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${headerB64}.${payloadB64}`));
  return `${headerB64}.${payloadB64}.${base64UrlEncode(new Uint8Array(sig))}`;
}

function base64UrlEncode(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(s: string): ArrayBuffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

// IP 哈希（不存储原始 IP，只存哈希值）
async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + '_nono_salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

// ===== 路由处理 =====
async function handleRequest(request: Request, env: Env): Promise<Response> {
  // CORS 预检
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // ===== 公开 API =====
  // 获取文章列表
  if (path === '/api/articles' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM articles WHERE status = ? ORDER BY date DESC').bind('published').all();
    const articles = results || [];
    // 附加标签
    for (const article of articles as any[]) {
      const tags = await env.DB.prepare('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?').bind(article.id).all();
      article.tags = (tags.results || []).map((t: any) => t.name);
    }
    return json(articles);
  }

  // 获取文章点赞数 + 当前 IP 是否已赞
  if (path.match(/^\/api\/articles\/[^/]+\/likes$/) && method === 'GET') {
    const id = path.split('/')[3];
    const article = await env.DB.prepare('SELECT likes FROM articles WHERE id = ?').bind(id).first() as any;
    if (!article) return error('文章不存在', 404);
    const ipHash = await hashIp(request.headers.get('CF-Connecting-IP') || '0.0.0.0');
    const liked = await env.DB.prepare('SELECT 1 FROM article_likes_ip WHERE article_id = ? AND ip_hash = ?').bind(id, ipHash).first();
    return json({ likes: article.likes || 0, liked: !!liked });
  }

  // 点赞文章（IP 去重，24小时后可再次点赞）
  if (path.match(/^\/api\/articles\/[^/]+\/like$/) && method === 'POST') {
    const id = path.split('/')[3];
    const ipHash = await hashIp(request.headers.get('CF-Connecting-IP') || '0.0.0.0');
    // 检查 24 小时内是否已赞
    const existing = await env.DB.prepare('SELECT created_at FROM article_likes_ip WHERE article_id = ? AND ip_hash = ?').bind(id, ipHash).first() as any;
    if (existing) {
      const hours = (Date.now() - new Date(existing.created_at + 'Z').getTime()) / 3600000;
      if (hours < 24) return error('24小时内只能点赞一次', 429);
    }
    await env.DB.prepare('INSERT OR REPLACE INTO article_likes_ip (article_id, ip_hash) VALUES (?, ?)').bind(id, ipHash).run();
    await env.DB.prepare('UPDATE articles SET likes = likes + 1 WHERE id = ?').bind(id).run();
    const updated = await env.DB.prepare('SELECT likes FROM articles WHERE id = ?').bind(id).first() as any;
    return json({ likes: updated.likes, liked: true });
  }

  // 获取单篇文章
  if (path.startsWith('/api/articles/') && method === 'GET') {
    const id = path.split('/')[3];
    const article = await env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first();
    if (!article) return error('文章不存在', 404);
    const tags = await env.DB.prepare('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?').bind(id).all();
    (article as any).tags = (tags.results || []).map((t: any) => t.name);
    // 自增浏览量 + 记录每日阅读
    await env.DB.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').bind(id).run();
    const today = new Date().toISOString().slice(0, 10);
    await env.DB.prepare('INSERT INTO daily_views (article_id, date, views) VALUES (?, ?, 1) ON CONFLICT(article_id, date) DO UPDATE SET views = views + 1').bind(id, today).run();
    return json(article);
  }

  // 获取项目列表
  if (path === '/api/projects' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM projects ORDER BY date DESC').all();
    const projects = results || [];
    for (const project of projects as any[]) {
      const tags = await env.DB.prepare('SELECT tag_name FROM project_tags WHERE project_id = ?').bind(project.id).all();
      project.tags = (tags.results || []).map((t: any) => t.tag_name);
    }
    return json(projects);
  }

  // 获取标签列表（动态计算文章数量）
  if (path === '/api/tags' && method === 'GET') {
    const { results } = await env.DB.prepare(
      `SELECT t.id, t.name, t.slug, t.color,
        (SELECT COUNT(*) FROM article_tags at2 JOIN articles a2 ON at2.article_id = a2.id WHERE at2.tag_id = t.id AND a2.status = 'published') as count
       FROM tags t ORDER BY count DESC`
    ).all();
    return json(results || []);
  }

  // 获取分类列表
  if (path === '/api/categories' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY id').all();
    return json(results || []);
  }

  // 获取已审核评论（按文章）
  if (path === '/api/comments' && method === 'GET') {
    const articleId = url.searchParams.get('articleId');
    if (articleId) {
      const { results } = await env.DB.prepare('SELECT * FROM comments WHERE article_id = ? AND status = ? ORDER BY date DESC').bind(articleId, 'approved').all();
      return json(results || []);
    }
    return error('缺少 articleId 参数');
  }

  // 提交评论（访客）
  if (path === '/api/comments' && method === 'POST') {
    const body = await request.json() as any;
    if (!body.author || !body.content || !body.articleId) return error('昵称、内容和文章ID为必填');
    const id = `c-${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    await env.DB.prepare('INSERT INTO comments (id, author, email, article_id, article_title, content, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, body.author, body.email || '', body.articleId, body.articleTitle || '', body.content, now, 'pending').run();
    return json({ id, message: '评论已提交，等待审核' }, 201);
  }

  // 获取站点配置
  if (path === '/api/settings' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT key, value FROM site_settings').all();
    const settings: Record<string, string> = {};
    for (const row of results as any[]) settings[row.key] = row.value;
    return json(settings);
  }

  // 管理员登录
  if (path === '/api/auth/login' && method === 'POST') {
    const body = await request.json() as any;
    const user = await env.DB.prepare('SELECT * FROM admin_users WHERE username = ?').bind(body.username).first() as any;
    if (!user) return error('用户名或密码错误', 401);
    // 简单密码比对（生产环境应使用 bcrypt）
    if (body.password !== user.password_hash) return error('用户名或密码错误', 401);
    const token = await signJwt({ sub: user.username, exp: Math.floor(Date.now() / 1000) + 604800 }, env.JWT_SECRET);
    return json({ token, username: user.username });
  }

  // ===== 管理员 API（需要 JWT） =====
  const auth = await verifyAuth(request, env.JWT_SECRET);
  if (!auth) return error('未授权', 401);

  // 管理员获取所有文章（含所有状态）
  if (path === '/api/admin/articles' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM articles ORDER BY date DESC').all();
    const articles = results || [];
    for (const article of articles as any[]) {
      const tags = await env.DB.prepare('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?').bind(article.id).all();
      article.tags = (tags.results || []).map((t: any) => t.name);
    }
    return json(articles);
  }

  // 获取所有评论（含待审核）
  if (path === '/api/admin/comments' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM comments ORDER BY date DESC').all();
    return json(results || []);
  }

  // 审核评论
  if (path.startsWith('/api/admin/comments/') && method === 'PUT') {
    const id = path.split('/')[4];
    const body = await request.json() as any;
    await env.DB.prepare('UPDATE comments SET status = ? WHERE id = ?').bind(body.status, id).run();
    return json({ message: '已更新' });
  }

  // 删除评论
  if (path.startsWith('/api/admin/comments/') && method === 'DELETE') {
    const id = path.split('/')[4];
    await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
    return json({ message: '已删除' });
  }

  // 创建文章
  if (path === '/api/admin/articles' && method === 'POST') {
    const body = await request.json() as any;
    const id = body.id || `article-${Date.now()}`;
    await env.DB.prepare('INSERT INTO articles (id, title, summary, content, date, category, read_time, gradient, thumbnail_type, status, cover_image, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .bind(id, body.title, body.summary, body.content || '', body.date || new Date().toISOString(), body.category, body.readTime || '', body.gradient || '', body.thumbnailType || 'starfield', body.status || 'draft', body.coverImage || '', new Date().toISOString(), new Date().toISOString()).run();
    // 处理标签关联
    if (body.tags?.length) {
      for (const tagName of body.tags) {
        const tag = await env.DB.prepare('SELECT id FROM tags WHERE name = ?').bind(tagName).first() as any;
        if (tag) await env.DB.prepare('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)').bind(id, tag.id).run();
      }
    }
    return json({ id, message: '文章已创建' }, 201);
  }

  // 更新文章（支持部分更新，只覆盖传入的字段）
  if (path.startsWith('/api/admin/articles/') && method === 'PUT') {
    const id = path.split('/')[4];
    const body = await request.json() as any;
    // 先读取现有数据，防止未传入的字段被覆盖为 null
    const existing = await env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first() as any;
    if (!existing) return error('文章不存在', 404);
    const title = body.title !== undefined ? body.title : existing.title;
    const summary = body.summary !== undefined ? body.summary : existing.summary;
    const content = body.content !== undefined ? body.content : existing.content;
    const category = body.category !== undefined ? body.category : existing.category;
    const readTime = body.readTime !== undefined ? body.readTime : (existing.read_time || '');
    const gradient = body.gradient !== undefined ? body.gradient : (existing.gradient || '');
    const thumbnailType = body.thumbnailType !== undefined ? body.thumbnailType : (existing.thumbnail_type || 'starfield');
    const status = body.status !== undefined ? body.status : existing.status;
    const coverImage = body.coverImage !== undefined ? body.coverImage : (existing.cover_image || '');
    const date = body.date !== undefined ? body.date : existing.date;
    await env.DB.prepare('UPDATE articles SET title=?, summary=?, content=?, category=?, read_time=?, gradient=?, thumbnail_type=?, status=?, cover_image=?, date=?, updated_at=? WHERE id=?')
      .bind(title, summary, content || '', category, readTime, gradient, thumbnailType, status, coverImage, date, new Date().toISOString(), id).run();
    // 更新标签关联（仅当传入 tags 时）
    if (body.tags !== undefined && Array.isArray(body.tags)) {
      await env.DB.prepare('DELETE FROM article_tags WHERE article_id = ?').bind(id).run();
      for (const tagName of body.tags) {
        const tag = await env.DB.prepare('SELECT id FROM tags WHERE name = ?').bind(tagName).first() as any;
        if (tag) await env.DB.prepare('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)').bind(id, tag.id).run();
      }
    }
    return json({ message: '文章已更新' });
  }

  // 删除文章
  if (path.startsWith('/api/admin/articles/') && method === 'DELETE') {
    const id = path.split('/')[4];
    await env.DB.prepare('DELETE FROM article_tags WHERE article_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run();
    return json({ message: '文章已删除' });
  }

  // 更新站点配置
  if (path === '/api/admin/settings' && method === 'PUT') {
    const body = await request.json() as Record<string, string>;
    for (const [key, value] of Object.entries(body)) {
      await env.DB.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)').bind(key, value).run();
    }
    return json({ message: '配置已更新' });
  }

  // 上传图片到 R2
  if (path === '/api/admin/upload' && method === 'POST') {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return error('缺少文件');
    if (file.size > 5 * 1024 * 1024) return error('文件大小不能超过 5MB');
    const ext = file.name.split('.').pop() || 'jpg';
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    await env.IMAGES.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
    const origin = new URL(request.url).origin;
    const imageUrl = `${origin}/api/images/${key}`;
    return json({ url: imageUrl, key }, 201);
  }

  // 获取每日阅读统计（管理员）
  if (path === '/api/admin/daily-views' && method === 'GET') {
    const range = url.searchParams.get('range') || 'week'; // week | month | year | all | custom
    const startDate = url.searchParams.get('start');
    const endDate = url.searchParams.get('end');
    let dateFilter = '';
    if (range === 'custom' && startDate && endDate) {
      dateFilter = ` AND date >= '${startDate}' AND date <= '${endDate}'`;
    } else if (range === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      dateFilter = ` AND date >= '${d.toISOString().slice(0, 10)}'`;
    } else if (range === 'month') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      dateFilter = ` AND date >= '${d.toISOString().slice(0, 10)}'`;
    } else if (range === 'year') {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 1);
      dateFilter = ` AND date >= '${d.toISOString().slice(0, 10)}'`;
    }
    const { results } = await env.DB.prepare(
      `SELECT date, SUM(views) as total FROM daily_views WHERE 1=1${dateFilter} GROUP BY date ORDER BY date`
    ).all();
    return json(results || []);
  }

  return error('未找到接口', 404);
}

// ===== 图片访问（公开，强缓存） =====
async function handleImage(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const key = url.pathname.replace('/api/images/', '');
  const object = await env.IMAGES.get(key);
  if (!object) return new Response('Not Found', { status: 404 });
  const headers = new Headers();
  if (object.httpMetadata?.contentType) headers.set('Content-Type', object.httpMetadata.contentType);
  // 强缓存：1年 + immutable（内容不变，浏览器不重复请求）
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  // Cloudflare CDN 缓存 30 天
  headers.set('CDN-Cache-Control', 'public, max-age=2592000');
  return new Response(object.body, { headers });
}

// ===== 入口 =====
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 安全迁移：确保 articles 表有 created_at / updated_at 字段
    try { await env.DB.prepare('ALTER TABLE articles ADD COLUMN created_at TEXT').run(); } catch {}
    try { await env.DB.prepare('ALTER TABLE articles ADD COLUMN updated_at TEXT').run(); } catch {}

    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/images/')) {
      return handleImage(request, env);
    }
    try {
      return await handleRequest(request, env);
    } catch (err: any) {
      return error(err.message || '服务器内部错误', 500);
    }
  },
};
