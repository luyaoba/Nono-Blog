"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Articles from "./components/Articles";
import ArticleDetail from "./components/ArticleDetail";
import Categories from "./components/Categories";
import About from "./components/About";
import SearchResults from "./components/Search";
import Tags from "./components/Tags";
import { ArrowUp } from "lucide-react";
import { translations } from "./data/translations";
import { api } from "./api";
import { mapArticles, mapProjects, mapCategories, mapSettings } from "./api";

import { 
  INITIAL_ARTICLES, 
  INITIAL_PROJECTS, 
  INITIAL_TAGS, 
  INITIAL_COMMENTS, 
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  Article,
  Project,
  Tag,
  Comment,
  SiteSettings,
  Category
} from "./data/mockAdminData";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [articlesFilter, setArticlesFilter] = useState<string>("全部");
  const [articlesSearch, setArticlesSearch] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Language state: zh (Chinese), en (English)
  const [language, setLanguage] = useState<"zh" | "en">(() => {
    const saved = localStorage.getItem("nono_language");
    return (saved === "en" ? "en" : "zh") as "zh" | "en";
  });

  useEffect(() => {
    localStorage.setItem("nono_language", language);
  }, [language]);

// Theme: 强制深色模式
  const theme = "dark" as const;
  const glowMode = true;
  const isLight = false;

  // Dynamic state databases - 优先从 API 加载，INITIAL_* 作为加载时回退
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  // 从 API 加载数据
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [articlesRes, projectsRes, tagsRes, categoriesRes, settingsRes] = await Promise.all([
          api.getArticles(),
          api.getProjects(),
          api.getTags(),
          api.getCategories(),
          api.getSettings(),
        ]);
        if (cancelled) return;
        if (articlesRes.length) setArticles(mapArticles(articlesRes));
        if (projectsRes.length) setProjects(mapProjects(projectsRes));
        if (tagsRes.length) setTags(tagsRes);
        if (categoriesRes.length) setCategories(mapCategories(categoriesRes));
        setSettings(mapSettings(settingsRes));
      } catch {
        // API 不可用时回退到 INITIAL 数据
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, []);

  // Dynamic page title from settings
  useEffect(() => {
    if (settings.siteTitle) {
      document.title = settings.siteTitle;
    } else if (settings.nickname) {
      document.title = `${settings.nickname}'s Blog`;
    }
  }, [settings.siteTitle, settings.nickname]);

  // Dynamic favicon from avatar
  useEffect(() => {
    if (settings.avatarUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.avatarUrl;
    }
  }, [settings.avatarUrl]);

  // Monitor scroll height to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Back to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Switch tabs smoothly
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsSearchActive(false);
    setSelectedArticleId(null);
    setArticlesFilter("全部");
    setArticlesSearch("");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Quick navigation helpers from Hero categories or Tag clicks
  const handleSelectCategory = (categoryName: string) => {
    setArticlesFilter(categoryName);
    setArticlesSearch("");
    setActiveTab("articles");
    setIsSearchActive(false);
    setSelectedArticleId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTag = (tagName: string) => {
    setActiveTab("articles");
    setIsSearchActive(false);
    setSelectedArticleId(null);
    setArticlesFilter("全部");
    setArticlesSearch(tagName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArticleClick = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsSearchActive(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    setSelectedArticleId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render active screen state
  const renderActiveScreen = () => {
    // If global search is togged in Navbar, display Search Results
    if (isSearchActive) {
      return (
        <SearchResults
          onArticleClick={handleArticleClick}
          onClearSearch={() => setIsSearchActive(false)}
          glowMode={glowMode}
          theme={theme}
          articles={articles.filter(a => a.status === "published")}
          language={language}
        />
      );
    }

    // If an article is actively clicked, display detail
    if (selectedArticleId) {
      return (
        <ArticleDetail
          articleId={selectedArticleId}
          onBack={() => setSelectedArticleId(null)}
          glowMode={glowMode}
          theme={theme}
          articles={articles}
          language={language}
        />
      );
    }

    // Fallback standard tabs
    switch (activeTab) {
      case "home":
        return <Hero onNavigate={handleTabChange} onSelectCategory={handleSelectCategory} glowMode={glowMode} theme={theme} settings={settings} categories={categories} articles={articles.filter(a => a.status === "published")} language={language} />;
      case "articles":
        return (
          <Articles
            onArticleClick={handleArticleClick}
            initialFilter={articlesFilter}
            initialSearch={articlesSearch}
            glowMode={glowMode}
            theme={theme}
            articles={articles.filter(a => a.status === "published")}
            categories={categories}
            language={language}
            settings={settings}
          />
        );
      case "categories":
        return <Categories onSelectCategory={handleSelectCategory} glowMode={glowMode} theme={theme} categories={categories} articles={articles.filter(a => a.status === "published")} language={language} settings={settings} />;
      case "about":
        return <About glowMode={glowMode} theme={theme} language={language} settings={settings} />;
      default:
        return <Hero onNavigate={handleTabChange} onSelectCategory={handleSelectCategory} glowMode={glowMode} theme={theme} categories={categories} articles={articles.filter(a => a.status === "published")} language={language} />;
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans relative transition-colors duration-1000 ${
        isLight
          ? "bg-[#f8f7f4] text-slate-800"
          : glowMode
          ? "bg-[#06070d] text-slate-100"
          : "bg-[#000000] text-slate-100"
      }`} 
      id="app-root"
    >
      {/* Dynamic Cosmic Grid Starfield Overlays (Only visible in Dark/Glow modes) */}
      {!isLight && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Sky glow orb bottom center (Only visible in glowMode) */}
          {glowMode && (
            <>
              <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.03] filter blur-[120px] transition-all duration-1000" />
              <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.015] filter blur-[100px]" />
            </>
          )}
          
          {/* Tiny grid pattern */}
          <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.012)_1px,_transparent_1px)] bg-[size:32px_32px] transition-all duration-1000 ${
            glowMode ? "opacity-40" : "opacity-15"
          }`} />

          {/* Full-page floating star particles */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${glowMode ? "opacity-20" : "opacity-8"}`}>
            <span className="absolute top-[5%] left-[8%] w-1 h-1 bg-white rounded-full animate-pulse" />
            <span className="absolute top-[12%] left-[22%] w-0.5 h-0.5 bg-sky-400 rounded-full" />
            <span className="absolute top-[8%] right-[18%] w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse duration-[3000ms]" />
            <span className="absolute top-[18%] left-[45%] w-0.5 h-0.5 bg-white rounded-full" />
            <span className="absolute top-[25%] right-[8%] w-1 h-1 bg-white rounded-full animate-pulse duration-[5000ms]" />
            <span className="absolute top-[30%] left-[12%] w-0.5 h-0.5 bg-sky-300 rounded-full" />
            <span className="absolute top-[35%] left-[65%] w-1 h-1 bg-indigo-300 rounded-full animate-pulse duration-[4000ms]" />
            <span className="absolute top-[40%] right-[25%] w-0.5 h-0.5 bg-white rounded-full" />
            <span className="absolute top-[45%] left-[5%] w-1 h-1 bg-white rounded-full" />
            <span className="absolute top-[50%] left-[35%] w-0.5 h-0.5 bg-purple-400 rounded-full animate-pulse duration-[6000ms]" />
            <span className="absolute top-[55%] right-[12%] w-1 h-1 bg-sky-400 rounded-full" />
            <span className="absolute top-[60%] left-[78%] w-0.5 h-0.5 bg-white rounded-full animate-pulse duration-[3500ms]" />
            <span className="absolute top-[65%] left-[20%] w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            <span className="absolute top-[72%] right-[35%] w-0.5 h-0.5 bg-white rounded-full" />
            <span className="absolute top-[78%] left-[50%] w-1 h-1 bg-white rounded-full animate-pulse duration-[4500ms]" />
            <span className="absolute top-[82%] right-[8%] w-0.5 h-0.5 bg-sky-300 rounded-full" />
            <span className="absolute top-[88%] left-[15%] w-1 h-1 bg-purple-300 rounded-full" />
            <span className="absolute top-[92%] left-[60%] w-0.5 h-0.5 bg-white rounded-full animate-pulse duration-[5500ms]" />
            <span className="absolute top-[95%] right-[20%] w-1 h-1 bg-indigo-300 rounded-full" />
          </div>
        </div>
      )}



      {/* Loading gate: 等 API 数据就绪后再渲染，避免 INITIAL 数据闪烁 */}
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
            <span className="text-sm font-mono text-slate-500 tracking-wider">Loading...</span>
          </div>
        </div>
      ) : (
      <>
      {/* Shared Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onSearchClick={handleSearchToggle}
        isSearchActive={isSearchActive}
        theme={theme}
        language={language}
        setLanguage={setLanguage}
        settings={settings}
      />

      {/* Main Core View Area */}
      <main className="flex-grow relative z-10 w-full" id="main-content-canvas">
        {renderActiveScreen()}

        {/* Dynamic Tags list embedded at bottom of Hero for visual balance & navigation (Matches section 8 tags) */}
        {activeTab === "home" && !isSearchActive && !selectedArticleId && (
          <div className={`border-t pt-12 pb-24 px-6 ${isLight ? "border-[#e5e2db]/60" : "border-white/[0.03]"}`}>
            <Tags onSelectTag={handleSelectTag} tags={tags} language={language} theme={theme} settings={settings} />
          </div>
        )}
      </main>

      {/* Persistent Space-Minimal Footer matching bottom cards */}
      <footer className={`border-t relative z-10 py-8 px-6 transition-colors duration-500 ${
        isLight
          ? "border-[#e5e2db]/80 bg-[#fefdfb]/60 text-slate-600 backdrop-blur-md" 
          : "border-white/[0.04] bg-[#090a10]/40 text-slate-500 backdrop-blur-md"
      }`} id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {language === "zh" 
                ? "服务器还活着，程序员还在掉头发 // BUG_-1 已修复" 
                : "Server alive, dev losing hair // BUG_-1 fixed"}
            </span>
          </div>
          <div className={`${isLight ? "text-slate-600" : "text-slate-400"}`}>
            {language === "zh"
              ? `© 2026 ${settings?.nickname || "Nono"} | 基于 ❤️ 与 Cloudflare 构建`
              : `© 2026 ${settings?.nickname || "Nono"} | Built with ❤️ and Cloudflare`}
          </div>
          <div>
            <span className={`hover:text-indigo-500 cursor-pointer ${isLight ? "text-slate-500" : "text-slate-400"}`} onClick={() => handleTabChange("about")}>
              {language === "zh" ? "关于我" : "ABOUT"}
            </span>
          </div>
        </div>
      </footer>
      </>
      )}

      {/* Scroll to Top floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 p-3 rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-md z-50 cursor-pointer hover:-translate-y-1 ${
            isLight
              ? "bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50"
              : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
          }`}
          title={language === "zh" ? "回顶部" : "Back to Top"}
          id="scroll-to-top-btn"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
