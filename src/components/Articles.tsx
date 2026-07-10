"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Calendar, Clock, Eye, Heart, ArrowRight } from "lucide-react";
import { translations } from "../data/translations";

export interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  views: number;
  likes?: number;
  comments: number;
  gradient: string; // Background gradient for high-quality thumbnail
  thumbnailType: "mesh" | "starfield" | "aurora" | "vortex";
  coverImage?: string;
  status?: "published" | "draft";
}

import { Category } from "../data/mockAdminData";

interface ArticlesProps {
  onArticleClick: (id: string) => void;
  initialFilter?: string;
  initialSearch?: string;
  glowMode?: boolean;
  theme?: "glow" | "dark" | "light";
  articles?: Article[];
  categories?: Category[];
  language?: "zh" | "en";
}

export const ARTICLES_DATA: Article[] = [
  {
    id: "cloudflare-deploy",
    title: "使用 Cloudflare 部署全栈应用",
    summary: "Cloudflare 不仅仅是一个 CDN。现在，就让我们利用 Pages、Workers 以及 D1/KV 数据库来搭建并部署一个极速、弹性、完全免费的现代全栈博客应用。本篇深度长文将带你完成全部链路...",
    date: "2024-05-20",
    category: "Cloudflare",
    tags: ["Cloudflare", "部署", "Next.js", "TypeScript"],
    readTime: "8分钟阅读",
    views: 1240,
    comments: 18,
    gradient: "from-blue-600/30 via-indigo-500/20 to-purple-600/30",
    thumbnailType: "starfield",
  },
  {
    id: "high-perf-blog",
    title: "从零构建一个高性能 Blog",
    summary: "极致的渲染速度与像素级还原是高端美学的底线。本文深入剖析如何使用 Vite 的深度打包策略、资源预加载、骨架屏微动效以及 Tailwind 极简主题机制，将 Lighthouse 评分稳稳锁定在 100 分...",
    date: "2024-05-15",
    category: "前端开发",
    tags: ["React", "Vite", "性能优化", "Tailwind"],
    readTime: "6分钟阅读",
    views: 890,
    comments: 12,
    gradient: "from-sky-500/30 via-teal-500/10 to-indigo-500/30",
    thumbnailType: "aurora",
  },
  {
    id: "tech-stack-2024",
    title: "我的 2024 技术栈与工具",
    summary: "身为不妥协的美学追求者，我的日常开发工具链是怎样的？本文全景分享我在 2024 年精选的编码、设计及个人知识管理套件，包含如何通过脚本全自动化发布多渠道文章的工作流...",
    date: "2024-05-01",
    category: "工具推荐",
    tags: ["工具", "配置", "Workflow", "Mac"],
    readTime: "5分钟阅读",
    views: 650,
    comments: 8,
    gradient: "from-amber-500/20 via-orange-500/10 to-rose-500/30",
    thumbnailType: "mesh",
  },
  {
    id: "design-patterns",
    title: "设计模式在前端中的应用",
    summary: "如何将经典的 23 种设计模式优雅、不显冗余地融入 React/TypeScript 状态引擎中？本文拆解单例模式、装饰器模式与命令模式，探讨如何构建高度可测试、低耦合的模块化组件...",
    date: "2024-04-20",
    category: "设计美学",
    tags: ["设计模式", "TypeScript", "架构", "React"],
    readTime: "10分钟阅读",
    views: 940,
    comments: 24,
    gradient: "from-purple-600/30 via-fuchsia-500/10 to-pink-500/30",
    thumbnailType: "vortex",
  },
];

export default function Articles({ 
  onArticleClick, 
  initialFilter = "全部", 
  initialSearch = "",
  glowMode = true, 
  theme = "glow", 
  articles = ARTICLES_DATA,
  categories: dynamicCategories = [],
  language = "zh"
}: ArticlesProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("");
  const itemsPerPage = 5;

  // Sync external filter changes
  useEffect(() => {
    setSelectedCategory(initialFilter);
  }, [initialFilter]);

  // Sync external search changes
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const isLight = theme === "light";
  const actualGlow = theme === "glow";
  const isZh = language === "zh";
  const t = translations[language];

  // Build category title→colorName mapping for filter matching
  const categoryMap: Record<string, string[]> = {};
  dynamicCategories.forEach(c => {
    if (!c.title) return;
    const keys = [c.title];
    if (c.colorName && c.colorName !== c.title) keys.push(c.colorName);
    categoryMap[c.title] = keys;
  });

  // Compute category list dynamically from categories db
  const categoriesList = dynamicCategories.length > 0
    ? ["\u5168\u90e8", ...Array.from(new Set(dynamicCategories.map(c => c.title).filter(t => t && t.trim() !== ""))).filter(c => c !== "\u5168\u90e8")]
    : (isZh ? ["\u5168\u90e8"] : ["All"]);
  
  const finalCategories = categoriesList.length <= 1
    ? categoriesList
    : categoriesList;

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Filter logic
  const filteredArticles = articles.filter((article) => {
    let matchesCategory = false;
    if (selectedCategory === "全部" || selectedCategory === "All") {
      matchesCategory = true;
    } else {
      // Match article.category against both title and colorName
      const matchKeys = categoryMap[selectedCategory] || [selectedCategory];
      matchesCategory = matchKeys.includes(article.category);
    }
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  // Render high-quality abstract thumbnail matching each post theme
  const renderThumbnail = (type: string, gradient: string) => {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} relative overflow-hidden flex items-center justify-center`}>
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:16px_16px] opacity-60" />
        
        {/* Abstract graphics based on type */}
        {type === "starfield" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
              <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5" />
            </div>
            {/* Stars */}
            <span className="absolute top-4 left-6 w-1 h-1 bg-white rounded-full opacity-60" />
            <span className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-sky-400 rounded-full opacity-40" />
            <span className="absolute top-12 right-12 w-1 h-1 bg-indigo-400 rounded-full opacity-80" />
          </div>
        )}

        {type === "aurora" && (
          <div className="absolute inset-0">
            <div className="absolute -top-10 left-10 w-24 h-24 bg-teal-500/30 rounded-full filter blur-xl animate-bounce duration-[8000ms]" />
            <div className="absolute bottom-2 right-12 w-20 h-20 bg-sky-500/20 rounded-full filter blur-lg" />
          </div>
        )}

        {type === "mesh" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border border-amber-500/20 rounded-lg rotate-45 flex items-center justify-center">
              <div className="w-8 h-8 border border-orange-500/30 rounded-md rotate-12" />
            </div>
          </div>
        )}

        {type === "vortex" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-t border-r border-fuchsia-500/30 animate-spin duration-[12000ms]" />
            <div className="w-14 h-14 rounded-full border-b border-l border-pink-500/20 absolute animate-spin duration-[6000ms] reverse" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative" id="articles-section">
      {/* Background glow */}
      {actualGlow && (
        <div className="absolute -top-20 left-[10%] w-[350px] h-[350px] rounded-full bg-blue-600/[0.02] blur-[120px] pointer-events-none transition-all duration-1000" />
      )}

      {/* Header section */}
      <div className="mb-12">
        <h1 className={`text-3xl font-extrabold tracking-wider flex items-center gap-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          {isZh ? "文章" : "Articles"}
          <span className={`text-sm font-mono font-normal px-3 py-1 rounded border ${
            isLight ? "border-indigo-100 bg-indigo-50/50 text-indigo-600" : "border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
          }`}>
            {filteredArticles.length} {isZh ? "篇" : "posts"}
          </span>
        </h1>
        <p className={`text-base mt-3 tracking-wide ${isLight ? "text-slate-600" : "text-slate-300"}`}>{isZh ? "记录学习与思考的点滴" : "Recording learning and reflections"}</p>
      </div>

      {/* Filter and Search Bar */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b pb-6 ${
        isLight ? "border-[#e5e2db]" : "border-white/[0.06]"
      }`}>
        {/* Tags filters */}
        <div className="flex flex-wrap items-center gap-2.5 pb-3 lg:pb-0" id="articles-tabs">
          {finalCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? isLight
                    ? "bg-indigo-600 text-white font-bold shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                    : "bg-white text-[#07080c] font-bold shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                  : isLight
                  ? "bg-[#f8f7f4] border border-[#e5e2db] text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30"
                  : "bg-white/[0.02] border border-white/[0.04] text-slate-400 hover:text-slate-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Inner Search Box */}
        <div className="relative w-full lg:max-w-xs" id="articles-search-container">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <Search className="w-4 h-4 text-indigo-400/80" />
          </div>
          <input
            type="text"
            placeholder={isZh ? "搜索文章标题、简介..." : "Search articles..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm tracking-wider outline-none transition-all ${
              isLight
                ? "bg-[#fefdfb] border-[#e5e2db] text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                : "border-white/[0.05] bg-[#0a0b12]/60 text-slate-200 placeholder-slate-500 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
            }`}
            id="articles-search-input"
          />
        </div>
      </div>

      {/* Main Articles List Layout (Horizontal Premium Glass Cards) */}
      <div className="grid grid-cols-1 gap-6" id="articles-list">
        {currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => onArticleClick(article.id)}
              className={`group cursor-pointer rounded-2xl border backdrop-blur-md overflow-hidden flex flex-col md:flex-row hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)] transition-all duration-300 relative h-auto md:h-[200px] ${
                isLight
                  ? "bg-[#fefdfb] border-[#e5e2db] hover:bg-[#fefdfb]/90 hover:border-indigo-200"
                  : "bg-[#0c0d14]/60 border-white/[0.06] hover:border-white/[0.12] hover:bg-[#10121e]/60"
              }`}
              id={`article-card-${article.id}`}
            >
              {/* Left/Top Thumbnail */}
              <div className={`w-full md:w-[240px] h-[140px] md:h-full shrink-0 relative border-b md:border-b-0 md:border-r ${
                isLight ? "border-[#e5e2db]" : "border-white/[0.04]"
              }`}>
                {article.coverImage ? (
                  <img 
                    src={article.coverImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  renderThumbnail(article.thumbnailType, article.gradient)
                )}
                {/* Float tag badge */}
                <span className="absolute top-3 left-3 text-[11px] font-mono font-bold uppercase tracking-wider bg-black/50 text-slate-300 border border-white/10 px-2.5 py-1 rounded-md backdrop-blur-md">
                  {article.category}
                </span>
              </div>

              {/* Right Content */}
              <div className="flex-grow p-6 flex flex-col justify-between">
                <div>
                  {/* Article Title & Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h2 className={`text-xl font-bold md:text-2xl group-hover:translate-x-0.5 transition-all line-clamp-1 ${
                      isLight ? "text-slate-800 group-hover:text-indigo-600" : "text-slate-100 group-hover:text-white"
                    }`}>
                      {article.title}
                    </h2>
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5 shrink-0">
                      <Calendar className="w-3.5 h-3.5" /> {article.date}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className={`text-sm line-clamp-2 leading-relaxed mb-4 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                    {article.summary}
                  </p>
                </div>

                {/* Footer and Meta data */}
                <div className={`flex items-center justify-between border-t pt-4 mt-auto ${
                  isLight ? "border-[#e5e2db]" : "border-white/[0.04]"
                }`}>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {article.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-400" /> {article.likes ?? 0}
                    </span>
                  </div>

                  {/* View Details button */}
                  <span className={`text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 select-none transition-all ${
                    isLight 
                      ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:text-indigo-700" 
                      : "bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300"
                  }`}>
                    {isZh ? "阅读全文" : "Read More"} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className={`py-20 text-center rounded-2xl border ${
            isLight ? "bg-[#fefdfb] border-[#e5e2db]" : "bg-[#0c0d14]/20 border-white/[0.04]"
          }`} id="articles-empty">
            <p className="text-sm text-slate-400 tracking-wider">{isZh ? "暂无匹配文章。尝试输入其他关键字。" : "No matching articles. Try different keywords."}</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12" id="articles-pagination">
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all border ${
                currentPage === 1
                  ? "opacity-30 cursor-not-allowed text-slate-500 border-transparent bg-transparent"
                  : isLight
                  ? "bg-[#fefdfb] border-[#e5e2db] text-slate-600 hover:bg-[#f8f7f4] cursor-pointer"
                  : "bg-white/[0.02] border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.05] cursor-pointer"
              }`}
            >
              {isZh ? "上一页" : "Prev"}
            </button>
            
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === p
                        ? isLight
                          ? "bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
                          : "bg-white text-slate-900 shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                        : isLight
                        ? "bg-[#f8f7f4] hover:bg-[#f0efeb] text-slate-600 hover:text-slate-800"
                        : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all border ${
                currentPage === totalPages
                  ? "opacity-30 cursor-not-allowed text-slate-500 border-transparent bg-transparent"
                  : isLight
                  ? "bg-[#fefdfb] border-[#e5e2db] text-slate-600 hover:bg-[#f8f7f4] cursor-pointer"
                  : "bg-[#0c0d14]/40 border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.05] cursor-pointer"
              }`}
            >
              {isZh ? "下一页" : "Next"}
            </button>
          </div>

          {/* Custom page jump */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{isZh ? "跳转到" : "Go to"}</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const p = parseInt(jumpPage, 10);
                  if (p >= 1 && p <= totalPages) {
                    setCurrentPage(p);
                    setJumpPage("");
                  }
                }
              }}
              className={`w-14 text-center border rounded-lg px-2 py-1.5 text-xs font-mono outline-none transition-all ${
                isLight
                  ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700 focus:border-indigo-400"
                  : "bg-white/[0.03] border-white/[0.08] text-slate-200 focus:border-indigo-500/40"
              }`}
              placeholder={`${currentPage}`}
            />
            <span>{isZh ? `页 / 共 ${totalPages} 页` : `/ ${totalPages}`}</span>
          </div>
        </div>
      )}
    </div>
  );
}
