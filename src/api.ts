/**
 * 博客 API 客户端
 * 封装所有与 Workers 后端的通信
 */

import type { Article, Project, Tag, Category, SiteSettings } from './data/mockAdminData';

const API_BASE = import.meta.env.VITE_API_URL || 'https://blog-api.187771.xyz';

// ===== 通用请求 =====
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `请求失败: ${res.status}`);
  }
  return res.json();
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ===== 公开 API =====
export const api = {
  // 文章
  getArticles: () => request<any[]>('/api/articles'),
  getArticle: (id: string) => request<any>(`/api/articles/${id}`),

  // 项目
  getProjects: () => request<any[]>('/api/projects'),

  // 标签
  getTags: () => request<any[]>('/api/tags'),

  // 分类
  getCategories: () => request<any[]>('/api/categories'),

  // 评论（已审核）
  getApprovedComments: (articleId: string) =>
    request<any[]>(`/api/comments?articleId=${articleId}`),

  // 提交评论
  submitComment: (data: { author: string; content: string; articleId: string; articleTitle?: string; email?: string }) =>
    request<any>('/api/comments', { method: 'POST', body: JSON.stringify(data) }),

  // 站点配置
  getSettings: () => request<Record<string, string>>('/api/settings'),

  // 每日阅读统计（需JWT）
  getDailyViews: (token: string, range: 'week' | 'month' | 'year' | 'all' | 'custom' = 'week', start?: string, end?: string) => {
    let url = `/api/admin/daily-views?range=${range}`;
    if (range === 'custom' && start && end) url += `&start=${start}&end=${end}`;
    return request<any[]>(url, { headers: authHeaders(token) });
  },

  // 登录
  login: (username: string, password: string) =>
    request<{ token: string; username: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};

// ===== 管理员 API（需 JWT） =====
export const adminApi = {
  // 评论管理
  getAllComments: (token: string) =>
    request<any[]>('/api/admin/comments', { headers: authHeaders(token) }),
  updateComment: (token: string, id: string, status: string) =>
    request<any>(`/api/admin/comments/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    }),
  deleteComment: (token: string, id: string) =>
    request<any>(`/api/admin/comments/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }),

  // 文章管理
  getArticles: (token: string) =>
    request<any[]>('/api/admin/articles', { headers: authHeaders(token) }),
  createArticle: (token: string, data: any) =>
    request<any>('/api/admin/articles', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),
  updateArticle: (token: string, id: string, data: any) =>
    request<any>(`/api/admin/articles/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),
  deleteArticle: (token: string, id: string) =>
    request<any>(`/api/admin/articles/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }),

  // 站点配置
  updateSettings: (token: string, settings: Record<string, string>) =>
    request<any>('/api/admin/settings', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(settings),
    }),

  // 图片上传（category: articles / covers / avatars / backgrounds）
  uploadImage: (token: string, file: File, category: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    return fetch(`${API_BASE}/api/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(r => r.json());
  },
};

// ===== API 响应字段映射（snake_case → camelCase）=====
export function mapArticles(rows: any[]): Article[] {
  return rows.map(r => ({
    id: r.id, title: r.title, summary: r.summary, content: r.content || '',
    date: r.date, category: r.category, tags: r.tags || [],
    readTime: r.read_time || '', views: r.views || 0, likes: r.likes || 0, comments: r.comments_count || 0,
    gradient: r.gradient || '', thumbnailType: r.thumbnail_type || 'starfield',
    status: r.status || 'published', coverImage: r.cover_image || '',
    created_at: r.created_at || '', updated_at: r.updated_at || '',
  }));
}
export function mapProjects(rows: any[]): Project[] {
  return rows.map(r => ({
    id: r.id, title: r.title, subtitle: r.subtitle || '', desc: r.description || '',
    category: r.category || '', tags: r.tags || [], githubUrl: r.github_url || '',
    liveUrl: r.live_url || '', date: r.date || '', glowColor: r.glow_color || '',
  }));
}
export function mapCategories(rows: any[]): Category[] {
  return rows.map(r => ({
    id: r.id, title: r.title, desc: r.description || '',
    colorName: r.color_name || '', iconType: r.icon_type || 'laptop',
  }));
}
export function mapSettings(obj: Record<string, string>): SiteSettings {
  return {
    nickname: obj.nickname || '', title: obj.title || '',
    avatarUrl: obj.avatarUrl || '', bio: obj.bio || '',
    siteTitle: obj.siteTitle || '', siteSlogan: obj.siteSlogan || '',
    siteDescription: obj.siteDescription || '',
    github: obj.github || '', twitter: obj.twitter || '',
    mail: obj.mail || '', homeImage: obj.homeImage || '',
    location: obj.location || '', siteSloganEn: obj.siteSloganEn || '',
    siteNotice: obj.siteNotice || '',
    categoriesTitle: obj.categoriesTitle || '',
    categoriesSubtitle: obj.categoriesSubtitle || '',
    categoriesTitleEn: obj.categoriesTitleEn || '',
    categoriesSubtitleEn: obj.categoriesSubtitleEn || '',
    tagsTitle: obj.tagsTitle || '',
    tagsSubtitle: obj.tagsSubtitle || '',
    tagsTitleEn: obj.tagsTitleEn || '',
    tagsSubtitleEn: obj.tagsSubtitleEn || '',
    heroTitle: obj.heroTitle || '',
    heroSubtitle: obj.heroSubtitle || '',
    heroTitleEn: obj.heroTitleEn || '',
    heroSubtitleEn: obj.heroSubtitleEn || '',
    articlesTitle: obj.articlesTitle || '',
    articlesSubtitle: obj.articlesSubtitle || '',
    articlesTitleEn: obj.articlesTitleEn || '',
    articlesSubtitleEn: obj.articlesSubtitleEn || '',
    // 关于页 - 统计卡片
    aboutStatsValue1: obj.aboutStatsValue1 || '',
    aboutStatsLabel1: obj.aboutStatsLabel1 || '',
    aboutStatsLabel1En: obj.aboutStatsLabel1En || '',
    aboutStatsValue2: obj.aboutStatsValue2 || '',
    aboutStatsLabel2: obj.aboutStatsLabel2 || '',
    aboutStatsLabel2En: obj.aboutStatsLabel2En || '',
    aboutStatsValue3: obj.aboutStatsValue3 || '',
    aboutStatsLabel3: obj.aboutStatsLabel3 || '',
    aboutStatsLabel3En: obj.aboutStatsLabel3En || '',
    // 关于页 - 技术栈与写作方向
    aboutFocusTitle: obj.aboutFocusTitle || '',
    aboutFocusTitleEn: obj.aboutFocusTitleEn || '',
    aboutFocus1Title: obj.aboutFocus1Title || '',
    aboutFocus1TitleEn: obj.aboutFocus1TitleEn || '',
    aboutFocus1Desc: obj.aboutFocus1Desc || '',
    aboutFocus1DescEn: obj.aboutFocus1DescEn || '',
    aboutFocus2Title: obj.aboutFocus2Title || '',
    aboutFocus2TitleEn: obj.aboutFocus2TitleEn || '',
    aboutFocus2Desc: obj.aboutFocus2Desc || '',
    aboutFocus2DescEn: obj.aboutFocus2DescEn || '',
    aboutFocus3Title: obj.aboutFocus3Title || '',
    aboutFocus3TitleEn: obj.aboutFocus3TitleEn || '',
    aboutFocus3Desc: obj.aboutFocus3Desc || '',
    aboutFocus3DescEn: obj.aboutFocus3DescEn || '',
  };
}
