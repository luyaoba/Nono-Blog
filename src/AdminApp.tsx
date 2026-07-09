"use client";

import { useState, useEffect } from "react";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminPosts from "./components/admin/AdminPosts";
import AdminTags from "./components/admin/AdminTags";
import AdminComments from "./components/admin/AdminComments";
import AdminSettings from "./components/admin/AdminSettings";

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

  // Admin auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("nono_admin_auth") === "true";
  });

  const [adminActiveTab, setAdminActiveTab] = useState<string>("dashboard");

  // Data states
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem("nono_articles");
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });
  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem("nono_tags");
    return saved ? JSON.parse(saved) : INITIAL_TAGS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("nono_categories");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const valid = Array.isArray(parsed) ? parsed.filter((c: Category) => c.title && c.title.trim() !== "") : [];
        return valid.length > 0 ? valid : INITIAL_CATEGORIES;
      } catch {
        return INITIAL_CATEGORIES;
      }
    }
    return INITIAL_CATEGORIES;
  });
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem("nono_comments");
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem("nono_settings");
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Persist data
  useEffect(() => { localStorage.setItem("nono_theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("nono_articles", JSON.stringify(articles)); }, [articles]);
  useEffect(() => { localStorage.setItem("nono_tags", JSON.stringify(tags)); }, [tags]);
  useEffect(() => { localStorage.setItem("nono_categories", JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem("nono_comments", JSON.stringify(comments)); }, [comments]);
  useEffect(() => { localStorage.setItem("nono_settings", JSON.stringify(settings)); }, [settings]);

  // Not authenticated: show login screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030408] text-slate-100 font-sans" id="admin-root">
        <AdminLogin
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true);
            localStorage.setItem("nono_admin_auth", "true");
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
          setIsAdminAuthenticated(false);
          localStorage.removeItem("nono_admin_auth");
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
