"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Laptop, Server, Cloud, Palette, PenTool, Wrench, ArrowUpRight, Brain, Globe, Cpu, Terminal, Flame, Sparkles, Rocket } from "lucide-react";
import { Category, Article } from "../data/mockAdminData";
import { translations } from "../data/translations";

interface CategoriesProps {
  onSelectCategory: (category: string) => void;
  glowMode?: boolean;
  theme?: "glow" | "dark" | "light";
  categories?: Category[];
  articles?: Article[];
  language?: "zh" | "en";
}

export default function Categories({ 
  onSelectCategory, 
  glowMode = true, 
  theme = "glow",
  categories = [],
  articles = [],
  language = "zh"
}: CategoriesProps) {
  const isLight = theme === "light";
  const actualGlow = theme === "glow";
  const isZh = language === "zh";
  const t = translations[language];

  // Pagination: 6 categories per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getCategoryTheme = (iconType: string) => {
    switch (iconType) {
      case "laptop":
        return {
          icon: <Laptop className={`w-5 h-5 ${isLight ? "text-sky-600" : "text-sky-400"}`} />,
          badgeColor: isLight ? "bg-sky-50 text-sky-600 border-sky-100" : "bg-sky-500/10 text-sky-400 border-sky-500/20",
          borderGlow: isLight ? "hover:border-sky-300" : "group-hover:border-sky-500/30 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.12)]",
        };
      case "server":
        return {
          icon: <Server className={`w-5 h-5 ${isLight ? "text-emerald-600" : "text-emerald-400"}`} />,
          badgeColor: isLight ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          borderGlow: isLight ? "hover:border-emerald-300" : "group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.12)]",
        };
      case "cloud":
        return {
          icon: <Cloud className={`w-5 h-5 ${isLight ? "text-blue-600" : "text-blue-400"}`} />,
          badgeColor: isLight ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-blue-500/10 text-blue-400 border-blue-500/20",
          borderGlow: isLight ? "hover:border-blue-300" : "group-hover:border-blue-500/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.12)]",
        };
      case "palette":
        return {
          icon: <Palette className={`w-5 h-5 ${isLight ? "text-indigo-600" : "text-indigo-400"}`} />,
          badgeColor: isLight ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          borderGlow: isLight ? "hover:border-indigo-300" : "group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(129,140,248,0.12)]",
        };
      case "pen-tool":
        return {
          icon: <PenTool className={`w-5 h-5 ${isLight ? "text-fuchsia-600" : "text-fuchsia-400"}`} />,
          badgeColor: isLight ? "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" : "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
          borderGlow: isLight ? "hover:border-fuchsia-300" : "group-hover:border-fuchsia-500/30 group-hover:shadow-[0_0_20px_rgba(240,85,252,0.12)]",
        };
      case "brain":
        return {
          icon: <Brain className={`w-5 h-5 ${isLight ? "text-purple-600" : "text-purple-400"}`} />,
          badgeColor: isLight ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-purple-500/10 text-purple-400 border-purple-500/20",
          borderGlow: isLight ? "hover:border-purple-300" : "group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]",
        };
      case "globe":
        return {
          icon: <Globe className={`w-5 h-5 ${isLight ? "text-indigo-600" : "text-indigo-400"}`} />,
          badgeColor: isLight ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          borderGlow: isLight ? "hover:border-indigo-300" : "group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]",
        };
      case "cpu":
        return {
          icon: <Cpu className={`w-5 h-5 ${isLight ? "text-teal-600" : "text-teal-400"}`} />,
          badgeColor: isLight ? "bg-teal-50 text-teal-600 border-teal-100" : "bg-teal-500/10 text-teal-400 border-teal-500/20",
          borderGlow: isLight ? "hover:border-teal-300" : "group-hover:border-teal-500/30 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.12)]",
        };
      case "terminal":
        return {
          icon: <Terminal className={`w-5 h-5 ${isLight ? "text-emerald-600" : "text-emerald-400"}`} />,
          badgeColor: isLight ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          borderGlow: isLight ? "hover:border-emerald-300" : "group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]",
        };
      case "flame":
        return {
          icon: <Flame className={`w-5 h-5 ${isLight ? "text-rose-600" : "text-rose-400"}`} />,
          badgeColor: isLight ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-rose-500/10 text-rose-400 border-rose-500/20",
          borderGlow: isLight ? "hover:border-rose-300" : "group-hover:border-rose-500/30 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.12)]",
        };
      case "sparkles":
        return {
          icon: <Sparkles className={`w-5 h-5 ${isLight ? "text-amber-600" : "text-amber-400"}`} />,
          badgeColor: isLight ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-amber-500/10 text-amber-400 border-amber-500/20",
          borderGlow: isLight ? "hover:border-amber-300" : "group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.12)]",
        };
      case "rocket":
        return {
          icon: <Rocket className={`w-5 h-5 ${isLight ? "text-indigo-600" : "text-indigo-400"}`} />,
          badgeColor: isLight ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          borderGlow: isLight ? "hover:border-indigo-300" : "group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]",
        };
      case "wrench":
      default:
        return {
          icon: <Wrench className={`w-5 h-5 ${isLight ? "text-amber-600" : "text-amber-400"}`} />,
          badgeColor: isLight ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-amber-500/10 text-amber-400 border-amber-500/20",
          borderGlow: isLight ? "hover:border-amber-300" : "group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.12)]",
        };
    }
  };

  // Filter out categories with empty titles, then fall back to defaults if needed
  const validCategories = categories.filter(c => c.title && c.title.trim() !== "");
  const displayList = validCategories.length > 0 ? validCategories : (isZh ? [
    { id: "frontend", title: "前端开发", desc: "探索 HTML5/CSS3、TypeScript、React/Next.js 等前沿网页客户端技术与工程化体系。", colorName: "前端开发", iconType: "laptop" as const },
    { id: "backend", title: "后端开发", desc: "精进微服务、高可用架构设计，深耕 Node.js、Go、Redis 及数据库存取模式。", colorName: "后端开发", iconType: "server" as const },
    { id: "cloud", title: "运维部署", desc: "分享 Cloudflare 生态、Docker 容器化管理与 CI/CD 极速部署的最佳实践。", colorName: "Cloudflare", iconType: "cloud" as const },
    { id: "design", title: "设计美学", desc: "像素级前端还原技术，前沿大厂视觉、排版美感设计与优雅微交互细节探索。", colorName: "设计美学", iconType: "palette" as const },
    { id: "life", title: "生活随笔", desc: "代码之外的纯粹表达。关于读书、徒步、技术博主的日常思绪碎碎念。", colorName: "全部", iconType: "pen-tool" as const },
    { id: "tools", title: "工具推荐", desc: "高生产力效率工具、高级命令行配置、自动化工作流等不妥协美学套件。", colorName: "工具推荐", iconType: "wrench" as const },
  ] : [
    { id: "frontend", title: "Frontend", desc: "Exploring HTML5/CSS3, TypeScript, React/Next.js and modern web engineering.", colorName: "前端开发", iconType: "laptop" as const },
    { id: "backend", title: "Backend", desc: "Microservices, HA architecture, Node.js, Go, Redis and database patterns.", colorName: "后端开发", iconType: "server" as const },
    { id: "cloud", title: "DevOps", desc: "Cloudflare ecosystem, Docker containerization and CI/CD best practices.", colorName: "Cloudflare", iconType: "cloud" as const },
    { id: "design", title: "Design", desc: "Pixel-perfect UI, visual aesthetics, typography and elegant micro-interactions.", colorName: "设计美学", iconType: "palette" as const },
    { id: "life", title: "Life", desc: "Beyond code — reading, hiking, and daily thoughts from a tech blogger.", colorName: "全部", iconType: "pen-tool" as const },
    { id: "tools", title: "Tools", desc: "Productivity tools, advanced CLI configs, and automation workflows.", colorName: "工具推荐", iconType: "wrench" as const },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative" id="categories-section">
      {/* Background glow */}
      {actualGlow && (
        <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-600/[0.02] blur-[120px] pointer-events-none" />
      )}

      {/* Header Info */}
      <div className="mb-12">
        <h1 className={`text-3xl font-extrabold tracking-wider flex items-center gap-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          {isZh ? "分类" : "Categories"}
          <span className={`text-sm font-mono font-normal px-3 py-1 rounded border ${
            isLight ? "border-indigo-100 bg-indigo-50/50 text-indigo-600" : "border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
          }`}>
            {isZh ? `共 ${displayList.length} 个分类` : `${displayList.length} Categories`}
          </span>
        </h1>
        <p className={`text-base mt-3 tracking-wide ${isLight ? "text-slate-600" : "text-slate-300"}`}>{isZh ? "分类探寻我感兴趣的研究与工程实践领域" : "Explore my areas of research and engineering practice"}</p>
      </div>

      {/* Grid Bento Layout */}
      {(() => {
        const totalPages = Math.ceil(displayList.length / itemsPerPage);
        const pagedList = displayList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        return (
          <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="categories-grid">
        {pagedList.map((cat, index) => {
          const catTheme = getCategoryTheme(cat.iconType || "laptop");
          
          // Compute dynamic counts from articles
          const count = cat.colorName === "全部" 
            ? articles.length 
            : articles.filter(art => art.category === cat.colorName).length;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              onClick={() => onSelectCategory(cat.colorName)}
              className={`group cursor-pointer p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between h-[240px] ${
                isLight
                  ? "bg-[#fefdfb] border-[#e5e2db] hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                  : "bg-[#0c0d14]/60 border-white/[0.06] hover:border-white/[0.12]"
              } ${catTheme.borderGlow}`}
              id={`category-card-${cat.id}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    isLight 
                      ? "bg-[#f8f7f4] border-[#e5e2db]/60 group-hover:bg-[#f0efeb]"  
                      : "bg-white/[0.02] border-white/[0.04] group-hover:bg-white/[0.05]"
                  }`}>
                    {catTheme.icon}
                  </div>
                  
                  {/* Count Badge */}
                  <span className={`text-xs font-mono border px-3 py-1 rounded-md tracking-wide font-semibold ${catTheme.badgeColor}`}>
                    {count} {isZh ? "篇文章" : "articles"}
                  </span>
                </div>

                {/* Title */}
                <h2 className={`text-lg font-bold group-hover:translate-x-0.5 transition-all mt-1 ${
                  isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-100 group-hover:text-white"
                }`}>
                  {cat.title}
                </h2>

                {/* Desc */}
                <p className={`text-sm mt-3 leading-relaxed line-clamp-3 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                  {cat.desc}
                </p>
              </div>

              {/* Link corner */}
              <div className={`flex justify-end items-center pt-3 border-t ${isLight ? "border-[#e5e2db]" : "border-white/[0.06]"}`}>
                <span className={`text-xs font-mono transition-colors flex items-center gap-1 ${
                  isLight ? "text-slate-500 group-hover:text-indigo-600" : "text-slate-400 group-hover:text-indigo-400"
                }`}>
                  {isZh ? "查看文章" : "View Articles"} <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all border ${
                    currentPage === 1
                      ? "opacity-30 cursor-not-allowed text-slate-500 border-transparent bg-transparent"
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
                            ? "bg-white text-slate-900 shadow-[0_0_12px_rgba(255,255,255,0.1)]"
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
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all border ${
                    currentPage === totalPages
                      ? "opacity-30 cursor-not-allowed text-slate-500 border-transparent bg-transparent"
                      : "bg-white/[0.02] border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.05] cursor-pointer"
                  }`}
                >
                  {isZh ? "下一页" : "Next"}
                </button>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}
