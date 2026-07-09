"use client";

import { useState, useEffect } from "react";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminPosts from "./components/admin/AdminPosts";
import AdminTags from "./components/admin/AdminTags";
import AdminComments from "./components/admin/AdminComments";
import AdminSettings from "./components/admin/AdminSettings";
import { api } from "./api";
import { mapArticles, mapCategories, mapSettings } from "./api";

import { 
  INITIAL_ARTICLES, 
  INITIAL_TAGS, 
  INITIAL_COMMENTS, 
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  Article,
  Tag,
  Comment,
  SiteSettings,
  Category
} from "./data/mockAdminData";

export default function AdminApp() {
  // Language state
  const [language, setLanguage] = useState<"zh" | "en">(() => {
    const saved = localStorage.getItem("nono_language");
    return (saved === "en" ? "en" : "zh") as "zh" | "en";
  });

  useEffect(() => {
    localStorage.setItem("nono_language", language);
  }, [language]);

  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("nono_theme");
    const allowed = ["dark", "light"];
    return (allowed.includes(saved || "") ? saved : "dark") as "dark" | "light";
  });

  const isLight = theme === "light";

  // Admin auth state - 存储 JWT token
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("nono_admin_token");
  });
  const isAdminAuthenticated = !!authToken;

  const [adminActiveTab, setAdminActiveTab] = useState<string>("dashboard");

  // Data states - 优先从 API 加载
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  // 从 API 加载数据
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [articlesRes, tagsRes, categoriesRes, settingsRes] = await Promise.all([
          api.getArticles(),
          api.getTags(),
          api.getCategories(),
          api.getSettings(),
        ]);
        if (cancelled) return;
        if (articlesRes.length) setArticles(mapArticles(articlesRes));
        if (tagsRes.length) setTags(tagsRes);
        if (categoriesRes.length) setCategories(mapCategories(categoriesRes));
        setSettings(mapSettings(settingsRes));
      } catch {
        // API 不可用时回退到 INITIAL 数据
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, []);

  // 加载所有评论（包括待审核）
  useEffect(() => {
    if (!authToken) return;
    fetch(`${import.meta.env.VITE_API_URL || 'https://blog-api.187771.xyz'}/api/admin/comments`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length) {
          setComments(data.map((c: any) => ({
            id: c.id, author: c.author, avatar: c.avatar || '', email: c.email || '',
            articleId: c.article_id, articleTitle: c.article_title,
            content: c.content, date: c.date, status: c.status,
          })));
        }
      })
      .catch(() => {});
  }, [authToken]);

  // Keep theme in cache
  useEffect(() => { localStorage.setItem("nono_theme", theme); }, [theme]);

  // Not authenticated: show login screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030408] text-slate-100 font-sans" id="admin-root">
        <AdminLogin
          onLoginSuccess={(token: string) => {
            setAuthToken(token);
            localStorage.setItem("nono_admin_token", token);
          }}
          onBackToHome={() => {
            window.location.href = "/";
          }}
        />
      </div>
    );
  }

  // Authenticated: show admin panel
  const renderAdminChild = () => {
    switch (adminActiveTab) {
      case "dashboard":
        return (
          <AdminDashboard
            articles={articles}
            tags={tags}
            comments={comments}
            onWritePost={() => setAdminActiveTab("posts")}
            onViewComments={() => setAdminActiveTab("comments")}
            language={language}
            theme={theme}
          />
        );
      case "posts":
        return (
          <AdminPosts
            articles={articles}
            onUpdateArticles={setArticles}
            categories={categories}
            language={language}
            theme={theme}
          />
        );
      case "tags":
        return (
          <AdminTags
            tags={tags}
            onUpdateTags={setTags}
            categories={categories}
            onUpdateCategories={setCategories}
            language={language}
            theme={theme}
          />
        );
      case "comments":
        return (
          <AdminComments
            comments={comments}
            onUpdateComments={setComments}
            language={language}
            theme={theme}
          />
        );
      case "settings":
        return (
          <AdminSettings
            settings={settings}
            onUpdateSettings={setSettings}
            language={language}
            theme={theme}
          />
        );
      default:
        return (
          <AdminDashboard
            articles={articles}
            tags={tags}
            comments={comments}
            onWritePost={() => setAdminActiveTab("posts")}
            onViewComments={() => setAdminActiveTab("comments")}
            language={language}
            theme={theme}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans relative ${isLight ? "bg-[#f5f4f0]" : "bg-[#07080e]"}`} id="admin-root">
      <AdminLayout
        activeSubTab={adminActiveTab}
        setActiveSubTab={setAdminActiveTab}
        onLogout={() => {
          setAuthToken(null);
          localStorage.removeItem("nono_admin_token");
        }}
        onExitConsole={() => {
          window.location.href = "/";
        }}
        language={language}
        theme={theme}
        setTheme={setTheme}
      >
        {renderAdminChild()}
      </AdminLayout>
    </div>
  );
}
