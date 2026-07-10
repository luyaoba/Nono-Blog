"use client";

import { useState, useEffect } from "react";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminPosts from "./components/admin/AdminPosts";
import AdminTags from "./components/admin/AdminTags";
import AdminSettings from "./components/admin/AdminSettings";
import { api } from "./api";
import { mapArticles, mapCategories, mapSettings } from "./api";

import { 
  INITIAL_ARTICLES, 
  INITIAL_TAGS, 
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  Article,
  Tag,
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

  // Theme: 强制深色模式
  const theme = "dark" as const;
  const isLight = false;

  // Admin auth state - 存储 JWT token
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("nono_admin_token");
  });
  const isAdminAuthenticated = !!authToken;

  const [adminActiveTab, setAdminActiveTab] = useState<string>("dashboard");

  // 自动登出函数（API 返回 401 时调用）
  const handleAutoLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("nono_admin_token");
  };

  // Data states - 优先从 API 加载
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [dataLoading, setDataLoading] = useState(true);

  // 刷新文章数据（确保浏览量等实时同步）
  const refreshArticles = async () => {
    try {
      const articlesRes = await api.getArticles();
      if (articlesRes.length) setArticles(mapArticles(articlesRes));
    } catch {}
  };

  // API 加载数据
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
      } catch (err: any) {
        // API 不可用时回退到 INITIAL 数据
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, []);

  // 切换 tab 时刷新文章数据
  useEffect(() => {
    if (isAdminAuthenticated && !dataLoading) {
      refreshArticles();
    }
  }, [adminActiveTab]);

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
            onWritePost={() => setAdminActiveTab("posts")}
            language={language}
            theme={theme}
            authToken={authToken}
          />
        );
      case "posts":
        return (
          <AdminPosts
            articles={articles}
            onUpdateArticles={setArticles}
            categories={categories}
            authToken={authToken}
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
      case "settings":
        return (
          <AdminSettings
            settings={settings}
            onUpdateSettings={setSettings}
            authToken={authToken}
            onAutoLogout={handleAutoLogout}
            language={language}
            theme={theme}
          />
        );
      default:
        return (
          <AdminDashboard
            articles={articles}
            tags={tags}
            onWritePost={() => setAdminActiveTab("posts")}
            language={language}
            theme={theme}
            authToken={authToken}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans relative ${isLight ? "bg-[#f5f4f0]" : "bg-[#07080e]"}`} id="admin-root">
      {dataLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
            <span className="text-sm font-mono text-slate-500 tracking-wider">{language === 'zh' ? '加载中...' : 'Loading...'}</span>
          </div>
        </div>
      ) : (
        <AdminLayout
          activeSubTab={adminActiveTab}
          setActiveSubTab={setAdminActiveTab}
          settings={settings}
          onLogout={() => {
            setAuthToken(null);
            localStorage.removeItem("nono_admin_token");
          }}
          onExitConsole={() => {
            window.location.href = "/";
          }}
          language={language}
          onLanguageChange={setLanguage}
          theme={theme}
        >
          {renderAdminChild()}
        </AdminLayout>
      )}
    </div>
  );
}
