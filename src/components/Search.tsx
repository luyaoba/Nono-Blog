"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, Calendar, Clock, ArrowRight, X } from "lucide-react";
import { Article } from "../data/mockAdminData";

interface SearchResultsProps {
  onArticleClick: (id: string) => void;
  onClearSearch?: () => void;
  glowMode: boolean;
  theme?: "glow" | "dark" | "light";
  articles: Article[];
  language?: "zh" | "en";
}

export default function SearchResults({ onArticleClick, onClearSearch, glowMode, theme = "glow", articles, language = "zh" }: SearchResultsProps) {
  const [searchTerm, setSearchTerm] = useState("Cloudflare");

  const isLight = theme === "light";
  const actualGlow = theme === "glow";
  const isZh = language === "zh";

  // Filter articles based on query
  const searchResults = articles.filter((article) => {
    return (
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative" id="search-section">
      {/* Background glow overlay */}
      {actualGlow && (
        <div className="absolute top-[10%] left-[20%] w-[380px] h-[380px] rounded-full bg-indigo-500/[0.015] blur-[150px] pointer-events-none transition-all duration-1000" />
      )}

      {/* Header Info */}
      <div className="mb-12">
        <h1 className={`text-3xl font-extrabold tracking-wider flex items-center gap-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          {isZh ? "搜索" : "Search"}
          <span className={`text-sm font-mono font-normal px-3 py-1 rounded border ${
            isLight ? "border-indigo-100 bg-indigo-50/50 text-indigo-600" : "border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
          }`}>
            {isZh ? `${searchResults.length} 条结果` : `${searchResults.length} results`}
          </span>
        </h1>
        <p className={`text-base mt-3 tracking-wide ${isLight ? "text-slate-600" : "text-slate-300"}`}>{isZh ? "推荐与搜索结果" : "Recommendations & Search Results"}</p>
      </div>

      {/* Prominent Search Bar matching Section 7 */}
      <div className="max-w-3xl mx-auto mb-12 relative" id="search-box-wrap">
        <div className="absolute left-4.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <Search className={`w-5.5 h-5.5 ${isLight ? "text-indigo-600/80" : "text-indigo-400/80"}`} />
        </div>
        <input
          type="text"
          placeholder="输入关键字搜索文章、分类或项目标签..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full border rounded-2xl pl-13 pr-12 py-3.5 text-base tracking-wider outline-none transition-all ${
            isLight
              ? "bg-[#fefdfb] border-[#e5e2db] text-slate-800 placeholder-slate-400 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 shadow-xs"
              : "bg-[#0c0d14]/60 border-white/[0.05] focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 text-slate-200 placeholder-slate-500"
          }`}
          id="search-main-input"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className={`absolute right-4.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
              isLight ? "hover:bg-[#f0efeb] text-slate-500 hover:text-slate-700" : "hover:bg-white/10 text-slate-400 hover:text-white"
            }`}
            title="清空搜索"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="max-w-3xl mx-auto space-y-4" id="search-results-list">
        {searchResults.length > 0 ? (
          searchResults.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => onArticleClick(article.id)}
              className={`group cursor-pointer p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 relative flex flex-col justify-between ${
                isLight
                  ? "bg-[#fefdfb] border-[#e5e2db] hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                  : "bg-[#0c0d14]/40 border-white/[0.04] hover:border-white/[0.1] hover:bg-[#10121e]/60"
              }`}
              id={`search-item-${article.id}`}
            >
              <div>
                {/* Meta details */}
                <div className={`flex items-center justify-between mb-3 text-xs font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {article.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {article.readTime}
                  </div>
                </div>

                {/* Title */}
                <h2 className={`text-base font-bold group-hover:translate-x-0.5 transition-all mb-2.5 ${
                  isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-200 group-hover:text-white"
                }`}>
                  {article.title}
                </h2>

                {/* Highlight summary matching search word */}
                <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                  {article.summary}
                </p>
              </div>

              {/* Tag links */}
              <div className={`flex items-center justify-between border-t pt-4 mt-5 ${isLight ? "border-[#e5e2db]" : "border-white/[0.03]"}`}>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded border ${
                        isLight
                          ? "bg-indigo-50/60 border-indigo-100/60 text-indigo-600"
                          : "bg-indigo-500/5 border-indigo-500/10 text-indigo-400"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className={`text-sm font-bold flex items-center gap-1 ${isLight ? "text-indigo-600 hover:text-indigo-700" : "text-indigo-400 group-hover:text-indigo-300"}`}>
                  {isZh ? "前往阅读" : "Read More"} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className={`py-20 text-center rounded-2xl border ${
            isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-600" : "bg-[#0c0d14]/20 border-white/[0.04] text-slate-400"
          }`} id="search-empty-result">
            <p className="text-sm tracking-wider">{isZh ? `未找到包含 "${searchTerm}" 的文章或标签。` : `No articles or tags found for "${searchTerm}".`}</p>
          </div>
        )}

        {/* Total stats */}
        <div className={`text-xs font-mono text-center pt-6 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          {isZh ? `共找到 ${searchResults.length} 篇相关文章` : `Found ${searchResults.length} articles`}
        </div>
      </div>
    </div>
  );
}
